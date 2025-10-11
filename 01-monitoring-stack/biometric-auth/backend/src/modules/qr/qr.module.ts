import { Module } from '@nestjs/common';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { RedisModule } from '../../common/redis/redis.module';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
  imports: [RedisModule, LoggerModule],
  controllers: [QrController],
  providers: [QrService],
  exports: [QrService],
})
export class QrModule {}
