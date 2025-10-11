import { Module } from '@nestjs/common';
import { WebauthnController } from './webauthn.controller';
import { WebauthnService } from './webauthn.service';
import { RedisModule } from '../../common/redis/redis.module';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
  imports: [RedisModule, LoggerModule],
  controllers: [WebauthnController],
  providers: [WebauthnService],
  exports: [WebauthnService],
})
export class WebauthnModule {}
