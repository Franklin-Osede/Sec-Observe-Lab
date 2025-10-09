const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const redis = require('redis');
const client = require('prom-client');
const WebAuthn = require('webauthn');
const QRCode = require('qrcode');
const { createCanvas } = require('canvas');
const faceapi = require('face-api.js');
const FingerprintJS = require('fingerprintjs2');
const WebSocket = require('ws');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Prometheus metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom metrics
const biometricAuthAttempts = new client.Counter({
  name: 'biometric_auth_attempts_total',
  help: 'Total number of biometric authentication attempts',
  labelNames: ['method', 'result'],
  registers: [register]
});

const biometricAuthDuration = new client.Histogram({
  name: 'biometric_auth_duration_seconds',
  help: 'Duration of biometric authentication in seconds',
  labelNames: ['method'],
  registers: [register]
});

const webauthnRegistrations = new client.Counter({
  name: 'webauthn_registration_total',
  help: 'Total number of WebAuthn registrations',
  labelNames: ['result'],
  registers: [register]
});

const webauthnAuthentications = new client.Counter({
  name: 'webauthn_authentication_total',
  help: 'Total number of WebAuthn authentications',
  labelNames: ['result'],
  registers: [register]
});

const fingerprintRecognitions = new client.Counter({
  name: 'fingerprint_recognition_total',
  help: 'Total number of fingerprint recognitions',
  labelNames: ['result'],
  registers: [register]
});

const faceRecognitions = new client.Counter({
  name: 'face_recognition_total',
  help: 'Total number of face recognitions',
  labelNames: ['result'],
  registers: [register]
});

const qrCodeGenerations = new client.Counter({
  name: 'qr_code_generation_total',
  help: 'Total number of QR codes generated',
  labelNames: ['result'],
  registers: [register]
});

const qrCodeValidations = new client.Counter({
  name: 'qr_code_validation_total',
  help: 'Total number of QR code validations',
  labelNames: ['result'],
  registers: [register]
});

// Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.connect();

// WebAuthn configuration
const webauthn = new WebAuthn({
  rpName: process.env.WEBAUTHN_RP_NAME || 'Sec-Observe-Lab',
  rpID: process.env.WEBAUTHN_RP_ID || 'localhost',
  origin: process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000'
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// WebAuthn registration
app.post('/api/webauthn/register/begin', [
  body('username').isLength({ min: 3, max: 50 }).trim().escape(),
  body('displayName').isLength({ min: 3, max: 50 }).trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, displayName } = req.body;
    const user = { id: username, name: displayName };

    const options = await webauthn.registrationOptions(user);
    
    // Store challenge in Redis
    await redisClient.setEx(`webauthn:challenge:${username}`, 300, JSON.stringify(options.challenge));
    
    webauthnRegistrations.inc({ result: 'attempt' });
    
    res.json(options);
  } catch (error) {
    console.error('WebAuthn registration begin error:', error);
    webauthnRegistrations.inc({ result: 'error' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/webauthn/register/complete', [
  body('username').isLength({ min: 3, max: 50 }).trim().escape(),
  body('credential').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, credential } = req.body;
    
    // Verify challenge
    const storedChallenge = await redisClient.get(`webauthn:challenge:${username}`);
    if (!storedChallenge) {
      return res.status(400).json({ error: 'Challenge not found or expired' });
    }

    const challenge = JSON.parse(storedChallenge);
    const verification = await webauthn.verifyRegistration(credential, challenge);
    
    if (verification.verified) {
      // Store credential in Redis
      await redisClient.setEx(`webauthn:credential:${username}`, 86400, JSON.stringify(credential));
      await redisClient.del(`webauthn:challenge:${username}`);
      
      webauthnRegistrations.inc({ result: 'success' });
      res.json({ verified: true });
    } else {
      webauthnRegistrations.inc({ result: 'failed' });
      res.status(400).json({ error: 'Verification failed' });
    }
  } catch (error) {
    console.error('WebAuthn registration complete error:', error);
    webauthnRegistrations.inc({ result: 'error' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// WebAuthn authentication
app.post('/api/webauthn/authenticate/begin', [
  body('username').isLength({ min: 3, max: 50 }).trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username } = req.body;
    
    // Get stored credential
    const storedCredential = await redisClient.get(`webauthn:credential:${username}`);
    if (!storedCredential) {
      return res.status(404).json({ error: 'User not found' });
    }

    const credential = JSON.parse(storedCredential);
    const options = await webauthn.authenticationOptions(credential);
    
    // Store challenge in Redis
    await redisClient.setEx(`webauthn:auth:challenge:${username}`, 300, JSON.stringify(options.challenge));
    
    webauthnAuthentications.inc({ result: 'attempt' });
    
    res.json(options);
  } catch (error) {
    console.error('WebAuthn authentication begin error:', error);
    webauthnAuthentications.inc({ result: 'error' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/webauthn/authenticate/complete', [
  body('username').isLength({ min: 3, max: 50 }).trim().escape(),
  body('credential').isObject()
], async (req, res) => {
  const startTime = Date.now();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, credential } = req.body;
    
    // Verify challenge
    const storedChallenge = await redisClient.get(`webauthn:auth:challenge:${username}`);
    if (!storedChallenge) {
      return res.status(400).json({ error: 'Challenge not found or expired' });
    }

    const challenge = JSON.parse(storedChallenge);
    const verification = await webauthn.verifyAuthentication(credential, challenge);
    
    const duration = (Date.now() - startTime) / 1000;
    biometricAuthDuration.observe({ method: 'webauthn' }, duration);
    
    if (verification.verified) {
      await redisClient.del(`webauthn:auth:challenge:${username}`);
      
      // Generate JWT token
      const token = jwt.sign(
        { username, method: 'webauthn' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );
      
      webauthnAuthentications.inc({ result: 'success' });
      biometricAuthAttempts.inc({ method: 'webauthn', result: 'success' });
      
      res.json({ verified: true, token });
    } else {
      webauthnAuthentications.inc({ result: 'failed' });
      biometricAuthAttempts.inc({ method: 'webauthn', result: 'failed' });
      res.status(400).json({ error: 'Authentication failed' });
    }
  } catch (error) {
    console.error('WebAuthn authentication complete error:', error);
    webauthnAuthentications.inc({ result: 'error' });
    biometricAuthAttempts.inc({ method: 'webauthn', result: 'error' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fingerprint recognition
app.post('/api/fingerprint/recognize', [
  body('fingerprintData').isString().isLength({ min: 100 }),
  body('username').isLength({ min: 3, max: 50 }).trim().escape()
], async (req, res) => {
  const startTime = Date.now();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fingerprintData, username } = req.body;
    
    // Simulate fingerprint recognition (in real implementation, use actual fingerprint SDK)
    const storedFingerprint = await redisClient.get(`fingerprint:${username}`);
    if (!storedFingerprint) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Simple similarity check (in real implementation, use proper fingerprint matching)
    const similarity = Math.random() > 0.1 ? 0.95 : 0.3; // Simulate 90% success rate
    const threshold = 0.8;
    
    const duration = (Date.now() - startTime) / 1000;
    biometricAuthDuration.observe({ method: 'fingerprint' }, duration);
    
    if (similarity >= threshold) {
      // Generate JWT token
      const token = jwt.sign(
        { username, method: 'fingerprint' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );
      
      fingerprintRecognitions.inc({ result: 'success' });
      biometricAuthAttempts.inc({ method: 'fingerprint', result: 'success' });
      
      res.json({ verified: true, token, similarity });
    } else {
      fingerprintRecognitions.inc({ result: 'failed' });
      biometricAuthAttempts.inc({ method: 'fingerprint', result: 'failed' });
      res.status(400).json({ error: 'Fingerprint recognition failed', similarity });
    }
  } catch (error) {
    console.error('Fingerprint recognition error:', error);
    fingerprintRecognitions.inc({ result: 'error' });
    biometricAuthAttempts.inc({ method: 'fingerprint', result: 'error' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Face recognition
app.post('/api/face/recognize', [
  body('faceData').isString().isLength({ min: 100 }),
  body('username').isLength({ min: 3, max: 50 }).trim().escape()
], async (req, res) => {
  const startTime = Date.now();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { faceData, username } = req.body;
    
    // Simulate face recognition (in real implementation, use actual face recognition SDK)
    const storedFace = await redisClient.get(`face:${username}`);
    if (!storedFace) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Simple similarity check (in real implementation, use proper face matching)
    const similarity = Math.random() > 0.1 ? 0.92 : 0.4; // Simulate 90% success rate
    const threshold = 0.8;
    
    const duration = (Date.now() - startTime) / 1000;
    biometricAuthDuration.observe({ method: 'face' }, duration);
    
    if (similarity >= threshold) {
      // Generate JWT token
      const token = jwt.sign(
        { username, method: 'face' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );
      
      faceRecognitions.inc({ result: 'success' });
      biometricAuthAttempts.inc({ method: 'face', result: 'success' });
      
      res.json({ verified: true, token, similarity });
    } else {
      faceRecognitions.inc({ result: 'failed' });
      biometricAuthAttempts.inc({ method: 'face', result: 'failed' });
      res.status(400).json({ error: 'Face recognition failed', similarity });
    }
  } catch (error) {
    console.error('Face recognition error:', error);
    faceRecognitions.inc({ result: 'error' });
    biometricAuthAttempts.inc({ method: 'face', result: 'error' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// QR Code generation
app.post('/api/qr/generate', [
  body('username').isLength({ min: 3, max: 50 }).trim().escape(),
  body('data').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, data } = req.body;
    
    // Generate QR code
    const qrData = {
      ...data,
      timestamp: Date.now(),
      username,
      challenge: Math.random().toString(36).substring(7)
    };
    
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData));
    
    // Store QR data in Redis
    await redisClient.setEx(`qr:${username}:${qrData.challenge}`, 300, JSON.stringify(qrData));
    
    qrCodeGenerations.inc({ result: 'success' });
    
    res.json({ qrCode: qrCodeDataURL, challenge: qrData.challenge });
  } catch (error) {
    console.error('QR code generation error:', error);
    qrCodeGenerations.inc({ result: 'error' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// QR Code validation
app.post('/api/qr/validate', [
  body('username').isLength({ min: 3, max: 50 }).trim().escape(),
  body('challenge').isString().isLength({ min: 7, max: 7 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, challenge } = req.body;
    
    // Get stored QR data
    const storedQRData = await redisClient.get(`qr:${username}:${challenge}`);
    if (!storedQRData) {
      return res.status(400).json({ error: 'QR code not found or expired' });
    }

    const qrData = JSON.parse(storedQRData);
    
    // Validate timestamp (5 minutes expiry)
    const now = Date.now();
    const qrTime = qrData.timestamp;
    if (now - qrTime > 300000) { // 5 minutes
      await redisClient.del(`qr:${username}:${challenge}`);
      return res.status(400).json({ error: 'QR code expired' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { username, method: 'qr' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    await redisClient.del(`qr:${username}:${challenge}`);
    
    qrCodeValidations.inc({ result: 'success' });
    biometricAuthAttempts.inc({ method: 'qr', result: 'success' });
    
    res.json({ verified: true, token });
  } catch (error) {
    console.error('QR code validation error:', error);
    qrCodeValidations.inc({ result: 'error' });
    biometricAuthAttempts.inc({ method: 'qr', result: 'error' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Biometric Auth Service running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await redisClient.quit();
  process.exit(0);
});
