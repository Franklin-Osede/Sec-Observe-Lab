import { Module } from '@nestjs/common';
import { FingerprintController } from './fingerprint.controller';
import { FingerprintService } from './fingerprint.service';
import { RedisModule } from '../../common/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [FingerprintController],
  providers: [FingerprintService],
  exports: [FingerprintService],
})
export class FingerprintModule {}
