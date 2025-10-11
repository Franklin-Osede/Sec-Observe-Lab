import { Module } from '@nestjs/common';
import { QrController, QrService } from './';
import { RedisModule } from '../../common/redis/redis.module';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
  imports: [RedisModule, LoggerModule],
  controllers: [QrController],
  providers: [QrService],
  exports: [QrService],
})
export class QrModule {}
