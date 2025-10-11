import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  private readonly logger = new Logger(QrService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async generateQrCode(username: string, data: string) {
    try {
      const qrData = {
        username,
        data,
        timestamp: new Date().toISOString(),
        challenge: Math.random().toString(36).substring(7),
      };

      // Generar código QR
      const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));

      // Guardar en Redis
      await this.redis.setex(
        `qr:${username}:${qrData.challenge}`,
        300, // 5 minutos
        JSON.stringify(qrData)
      );

      this.logger.log(`Código QR generado para usuario: ${username}`);
      return {
        success: true,
        qrCodeUrl,
        challenge: qrData.challenge,
        expiresAt: new Date(Date.now() + 300000).toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error generando código QR: ${error.message}`);
      throw error;
    }
  }

  async validateQrCode(username: string, qrCode: string) {
    try {
      const parsedData = JSON.parse(qrCode);
      const storedData = await this.redis.get(`qr:${username}:${parsedData.challenge}`);

      if (!storedData) {
        throw new Error('Código QR no encontrado o expirado');
      }

      const validationResult = {
        success: true,
        username,
        timestamp: new Date().toISOString(),
      };

      // Limpiar código QR usado
      await this.redis.del(`qr:${username}:${parsedData.challenge}`);

      this.logger.log(`Código QR validado para usuario: ${username}`);
      return validationResult;
    } catch (error) {
      this.logger.error(`Error validando código QR: ${error.message}`);
      throw error;
    }
  }

  async getHealth() {
    try {
      // Verificar conexión a Redis
      await this.redis.ping();

      return {
        status: 'healthy',
        module: 'qr',
        timestamp: new Date().toISOString(),
        redis: 'connected',
      };
    } catch (error) {
      this.logger.error(`Error verificando salud del módulo QR: ${error.message}`);
      return {
        status: 'unhealthy',
        module: 'qr',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }
}
