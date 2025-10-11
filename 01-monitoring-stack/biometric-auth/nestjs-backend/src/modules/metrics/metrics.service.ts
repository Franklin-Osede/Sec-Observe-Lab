import { Injectable, Logger } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  private readonly register = new client.Registry();

  constructor() {
    // Registrar métricas por defecto
    client.collectDefaultMetrics({ register: this.register });
    
    // Métricas personalizadas
    this.registerCustomMetrics();
  }

  private registerCustomMetrics() {
    // Contador de intentos biométricos
    new client.Counter({
      name: 'biometric_auth_attempts_total',
      help: 'Total number of biometric authentication attempts',
      labelNames: ['method', 'result'],
      registers: [this.register]
    });

    // Histograma de duración
    new client.Histogram({
      name: 'biometric_auth_duration_seconds',
      help: 'Duration of biometric authentication in seconds',
      labelNames: ['method'],
      registers: [this.register]
    });

    // Contador de WebAuthn
    new client.Counter({
      name: 'webauthn_registration_total',
      help: 'Total number of WebAuthn registrations',
      labelNames: ['result'],
      registers: [this.register]
    });

    new client.Counter({
      name: 'webauthn_authentication_total',
      help: 'Total number of WebAuthn authentications',
      labelNames: ['result'],
      registers: [this.register]
    });

    // Contador de huella dactilar
    new client.Counter({
      name: 'fingerprint_recognition_total',
      help: 'Total number of fingerprint recognitions',
      labelNames: ['result'],
      registers: [this.register]
    });

    // Contador de reconocimiento facial
    new client.Counter({
      name: 'face_recognition_total',
      help: 'Total number of face recognitions',
      labelNames: ['result'],
      registers: [this.register]
    });

    // Contador de QR
    new client.Counter({
      name: 'qr_code_generation_total',
      help: 'Total number of QR code generations',
      labelNames: ['result'],
      registers: [this.register]
    });

    new client.Counter({
      name: 'qr_code_validation_total',
      help: 'Total number of QR code validations',
      labelNames: ['result'],
      registers: [this.register]
    });
  }

  async getMetrics(): Promise<string> {
    try {
      return this.register.metrics();
    } catch (error) {
      this.logger.error(`Error obteniendo métricas: ${error.message}`);
      throw error;
    }
  }

  getRegister() {
    return this.register;
  }
}
