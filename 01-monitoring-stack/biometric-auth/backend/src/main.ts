import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor, TransformInterceptor } from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS configuration
  app.enableCors({
    origin: ['http://localhost:4201', 'http://localhost:4200', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Sec-Observe-Lab Biometric Auth API')
    .setDescription('API para autenticación biométrica con WebAuthn, huella dactilar, reconocimiento facial y códigos QR')
    .setVersion('1.0.0')
    .addTag('webauthn', 'WebAuthn - Autenticación biométrica estándar')
    .addTag('fingerprint', 'Huella dactilar')
    .addTag('face', 'Reconocimiento facial')
    .addTag('qr', 'Códigos QR')
    .addTag('metrics', 'Métricas y monitoreo')
    .addTag('health', 'Salud del sistema')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Health check endpoint
  app.use('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Metrics endpoint
  app.use('/metrics', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send('# Prometheus metrics endpoint');
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Sec-Observe-Lab Biometric Auth API`);
  console.log(`📱 Running on: http://localhost:${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/api-docs`);
  console.log(`🏥 Health: http://localhost:${port}/health`);
  console.log(`📊 Metrics: http://localhost:${port}/metrics`);
}

bootstrap();
