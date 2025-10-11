import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class FaceService {
  private readonly logger = new Logger(FaceService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async recognizeFace(username: string, faceData: string) {
    try {
      // Simular reconocimiento facial
      const recognitionResult = {
        success: true,
        username,
        confidence: Math.random() * 100,
        timestamp: new Date().toISOString(),
      };

      // Guardar resultado en Redis
      await this.redis.setex(
        `face:${username}:${Date.now()}`,
        3600,
        JSON.stringify(recognitionResult)
      );

      this.logger.log(`Rostro reconocido para usuario: ${username}`);
      return recognitionResult;
    } catch (error) {
      this.logger.error(`Error reconociendo rostro: ${error.message}`);
      throw error;
    }
  }

  async getHealth() {
    try {
      // Verificar conexión a Redis
      await this.redis.ping();

      return {
        status: 'healthy',
        module: 'face',
        timestamp: new Date().toISOString(),
        redis: 'connected',
      };
    } catch (error) {
      this.logger.error(`Error verificando salud del módulo Face: ${error.message}`);
      return {
        status: 'unhealthy',
        module: 'face',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }
}
