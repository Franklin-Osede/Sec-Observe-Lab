const request = require('supertest');
const app = require('../src/index');

describe('Biometric Authentication Service', () => {
  let server;

  beforeAll(async () => {
    server = app.listen(0);
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  describe('Health Check', () => {
    test('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Metrics Endpoint', () => {
    test('should return Prometheus metrics', async () => {
      const response = await request(app)
        .get('/metrics')
        .expect(200);

      expect(response.text).toContain('# HELP');
      expect(response.text).toContain('biometric_auth_attempts_total');
    });
  });

  describe('WebAuthn Registration', () => {
    test('should begin registration process', async () => {
      const response = await request(app)
        .post('/api/v1/webauthn/register/begin')
        .send({
          username: 'testuser',
          displayName: 'Test User'
        })
        .expect(200);

      expect(response.body.challenge).toBeDefined();
      expect(response.body.rp).toBeDefined();
    });

    test('should validate registration data', async () => {
      const response = await request(app)
        .post('/api/v1/webauthn/register/begin')
        .send({
          username: 'a', // Too short
          displayName: 'Test User'
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('WebAuthn Authentication', () => {
    test('should begin authentication process', async () => {
      // First register a user
      const registerResponse = await request(app)
        .post('/api/v1/webauthn/register/begin')
        .send({
          username: 'testuser',
          displayName: 'Test User'
        })
        .expect(200);

      // Wait a bit for the challenge to be stored
      await new Promise(resolve => setTimeout(resolve, 100));

      // Complete the registration
      await request(app)
        .post('/api/v1/webauthn/register/complete')
        .send({
          username: 'testuser',
          credential: {
            id: 'test-credential-id',
            rawId: 'test-raw-id',
            response: {
              attestationObject: 'test-attestation',
              clientDataJSON: 'test-client-data'
            },
            type: 'public-key'
          }
        })
        .expect(200);

      // Then try to authenticate
      const response = await request(app)
        .post('/api/v1/webauthn/authenticate/begin')
        .send({
          username: 'testuser'
        })
        .expect(200);

      expect(response.body.challenge).toBeDefined();
    });

    test('should handle non-existent user', async () => {
      const response = await request(app)
        .post('/api/v1/webauthn/authenticate/begin')
        .send({
          username: 'nonexistent'
        })
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });
  });

  describe('Fingerprint Recognition', () => {
    test('should handle fingerprint recognition', async () => {
      // First create a user with fingerprint data
      const redis = require('redis');
      const redisClient = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });
      await redisClient.connect();
      await redisClient.setEx('fingerprint:testuser', 3600, 'test_fingerprint_data_123456789');
      await redisClient.quit();

      const response = await request(app)
        .post('/api/v1/fingerprint/recognize')
        .send({
          fingerprintData: 'test_fingerprint_data_123456789',
          username: 'testuser'
        })
        .expect(200);

      expect(response.body.verified).toBeDefined();
      expect(response.body.similarity).toBeDefined();
    });

    test('should validate fingerprint data', async () => {
      const response = await request(app)
        .post('/api/v1/fingerprint/recognize')
        .send({
          fingerprintData: 'short', // Too short
          username: 'testuser'
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('Face Recognition', () => {
    test('should handle face recognition', async () => {
      // First create a user with face data
      const redis = require('redis');
      const redisClient = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });
      await redisClient.connect();
      await redisClient.setEx('face:testuser', 3600, 'test_face_data_123456789');
      await redisClient.quit();

      const response = await request(app)
        .post('/api/v1/face/recognize')
        .send({
          faceData: 'test_face_data_123456789',
          username: 'testuser'
        })
        .expect(200);

      expect(response.body.verified).toBeDefined();
      expect(response.body.similarity).toBeDefined();
    });
  });

  describe('QR Code Generation', () => {
    test('should generate QR code', async () => {
      const response = await request(app)
        .post('/api/v1/qr/generate')
        .send({
          username: 'testuser',
          data: { action: 'login' }
        })
        .expect(200);

      expect(response.body.qrCode).toBeDefined();
      expect(response.body.challenge).toBeDefined();
    });

    test('should validate QR code data', async () => {
      const response = await request(app)
        .post('/api/v1/qr/generate')
        .send({
          username: 'a', // Too short
          data: { action: 'login' }
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('QR Code Validation', () => {
    test('should validate QR code', async () => {
      // First generate a QR code
      const generateResponse = await request(app)
        .post('/api/v1/qr/generate')
        .send({
          username: 'testuser',
          data: { action: 'login' }
        })
        .expect(200);

      const challenge = generateResponse.body.challenge;

      // Wait a bit to ensure the QR code is stored
      await new Promise(resolve => setTimeout(resolve, 100));

      // Then validate it
      const response = await request(app)
        .post('/api/v1/qr/validate')
        .send({
          username: 'testuser',
          challenge: challenge
        })
        .expect(200);

      expect(response.body.verified).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    test('should handle invalid challenge', async () => {
      const response = await request(app)
        .post('/api/v1/qr/validate')
        .send({
          username: 'testuser',
          challenge: 'invalid'
        })
        .expect(400);

      expect(response.body.error).toBe('QR code not found or expired');
    });
  });

  describe('Rate Limiting', () => {
    test('should apply rate limiting', async () => {
      const requests = [];
      
      // Make multiple requests to an API endpoint (not health)
      for (let i = 0; i < 150; i++) {
        requests.push(
          request(app)
            .post('/api/v1/webauthn/register/begin')
            .send({
              username: `testuser${i}`,
              displayName: 'Test User'
            })
        );
      }

      const responses = await Promise.all(requests);
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed JSON', async () => {
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await request(app)
        .post('/api/v1/fingerprint/recognize')
        .send('invalid json')
        .expect(400);
    });

    test('should handle missing required fields', async () => {
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await request(app)
        .post('/api/v1/face/recognize')
        .send({})
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });
});
