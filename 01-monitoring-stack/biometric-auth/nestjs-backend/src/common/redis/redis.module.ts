import { Module } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    NestRedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      options: {
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
      },
    }),
  ],
  exports: [NestRedisModule],
})
export class RedisModule {}
