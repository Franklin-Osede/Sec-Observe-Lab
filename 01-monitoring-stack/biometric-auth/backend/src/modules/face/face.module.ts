import { Module } from '@nestjs/common';
import { FaceController } from './face.controller';
import { FaceService } from './face.service';
import { RedisModule } from '../../common/redis/redis.module';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
  imports: [RedisModule, LoggerModule],
  controllers: [FaceController],
  providers: [FaceService],
  exports: [FaceService],
})
export class FaceModule {}
