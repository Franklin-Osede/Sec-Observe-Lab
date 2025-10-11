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
      return recognitionResult;
    } catch (error) {
      this.logger.error(`Error reconociendo huella dactilar: ${error.message}`);
      throw error;
    }
  }
}
