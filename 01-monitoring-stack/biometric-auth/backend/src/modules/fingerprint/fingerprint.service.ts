import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class FingerprintService {
  private readonly logger = new Logger(FingerprintService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async recognizeFingerprint(username: string, fingerprintData: string) {
    try {
      // Simular reconocimiento de huella dactilar
      const recognitionResult = {
        success: true,
        username,
        confidence: Math.random() * 100,
        timestamp: new Date().toISOString(),
      };

      // Guardar resultado en Redis
      await this.redis.setex(
        `fingerprint:${username}:${Date.now()}`,
        3600,
        JSON.stringify(recognitionResult)
      );

      this.logger.log(`Huella dactilar reconocida para usuario: ${username}`);
      
      // Incrementar métricas
      await this.redis.incr('fingerprint_recognition_total');
      await this.redis.incr('biometric_auth_attempts_total');
      
      return recognitionResult;
    } catch (error) {
      this.logger.error(`Error reconociendo huella dactilar: ${error.message}`);
      throw error;
    }
  }

  async getHealth() {
    try {
      // Verificar conexión a Redis
      await this.redis.ping();

      return {
        status: 'healthy',
        module: 'fingerprint',
        timestamp: new Date().toISOString(),
        redis: 'connected',
      };
    } catch (error) {
      this.logger.error(`Error verificando salud del módulo Fingerprint: ${error.message}`);
      return {
        status: 'unhealthy',
        module: 'fingerprint',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }
}
