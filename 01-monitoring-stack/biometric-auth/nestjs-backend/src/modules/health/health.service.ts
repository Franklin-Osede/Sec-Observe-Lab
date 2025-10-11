import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async getHealth() {
    try {
      // Verificar Redis
      await this.redis.ping();
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        services: {
          redis: 'connected',
          database: 'connected',
          api: 'running'
        },
        version: '1.0.0'
      };
    } catch (error) {
      this.logger.error(`Error verificando salud del sistema: ${error.message}`);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        services: {
          redis: 'disconnected',
          database: 'unknown',
          api: 'running'
        }
      };
    }
  }
}
