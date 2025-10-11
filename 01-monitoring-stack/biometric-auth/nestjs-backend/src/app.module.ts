import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
// import { PrometheusModule } from '@nestjs/prometheus'; // No disponible

// Modules
import { WebauthnModule } from './modules/webauthn/webauthn.module';
import { FingerprintModule } from './modules/fingerprint/fingerprint.module';
import { FaceModule } from './modules/face/face.module';
import { QrModule } from './modules/qr/qr.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';

// Common
import { DatabaseModule } from './common/database/database.module';
import { RedisModule } from './common/redis/redis.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Caching
    CacheModule.register({
      ttl: 300, // 5 minutes
      max: 1000, // 1000 items
    }),

    // Scheduling
    ScheduleModule.forRoot(),

    // Health checks
    TerminusModule,

    // Prometheus metrics - usando prom-client directamente

    // Database and Redis
    DatabaseModule,
    RedisModule,
    LoggerModule,

    // Feature modules
    WebauthnModule,
    FingerprintModule,
    FaceModule,
    QrModule,
    MetricsModule,
    HealthModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
