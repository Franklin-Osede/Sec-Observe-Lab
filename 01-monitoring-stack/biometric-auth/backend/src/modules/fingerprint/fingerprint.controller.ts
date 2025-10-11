import { Controller, Post, Body, Get, Param, Logger } from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';
import { FingerprintService } from './fingerprint.service';

export class FingerprintDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  
  @IsString()
  @IsNotEmpty()
  fingerprintData: string;
}

@Controller('fingerprint')
export class FingerprintController {
  private readonly logger = new Logger(FingerprintController.name);

  constructor(private readonly fingerprintService: FingerprintService) {}

  @Post('recognize')
  async recognizeFingerprint(@Body() fingerprintDto: FingerprintDto) {
    try {
      this.logger.log(`Reconocimiento de huella dactilar para usuario: ${fingerprintDto.username}`);
      
      const result = await this.fingerprintService.recognizeFingerprint(
        fingerprintDto.username,
        fingerprintDto.fingerprintData
      );

      return {
        success: true,
        data: result,
        message: 'Huella dactilar reconocida exitosamente'
      };
    } catch (error) {
      this.logger.error(`Error en reconocimiento de huella: ${error.message}`);
      return {
        success: false,
        error: error.message,
        message: 'Error en el reconocimiento de huella dactilar'
      };
    }
  }

  @Get('health')
  async getHealth() {
    try {
      const health = await this.fingerprintService.getHealth();
      return {
        success: true,
        data: health,
        message: 'Módulo de huella dactilar funcionando correctamente'
      };
    } catch (error) {
      this.logger.error(`Error verificando salud del módulo fingerprint: ${error.message}`);
      return {
        success: false,
        error: error.message,
        message: 'Error verificando salud del módulo'
      };
    }
  }
}
