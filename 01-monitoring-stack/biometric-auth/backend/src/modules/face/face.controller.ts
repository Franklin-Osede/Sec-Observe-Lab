import { Controller, Post, Body, Get, Logger } from '@nestjs/common';
import { FaceService } from './face.service';

export class FaceRecognitionDto {
  username: string;
  faceData: string;
}

@Controller('face')
export class FaceController {
  private readonly logger = new Logger(FaceController.name);

  constructor(private readonly faceService: FaceService) {}

  @Post('recognize')
  async recognizeFace(@Body() faceDto: FaceRecognitionDto) {
    try {
      this.logger.log(`Reconocimiento facial para usuario: ${faceDto.username}`);
      
      const result = await this.faceService.recognizeFace(
        faceDto.username,
        faceDto.faceData
      );

      return {
        success: true,
        data: result,
        message: 'Reconocimiento facial exitoso'
      };
    } catch (error) {
      this.logger.error(`Error en reconocimiento facial: ${error.message}`);
      return {
        success: false,
        error: error.message,
        message: 'Error en el reconocimiento facial'
      };
    }
  }

  @Get('health')
  async getHealth() {
    try {
      const health = await this.faceService.getHealth();
      return {
        success: true,
        data: health,
        message: 'Módulo de reconocimiento facial funcionando correctamente'
      };
    } catch (error) {
      this.logger.error(`Error verificando salud del módulo face: ${error.message}`);
      return {
        success: false,
        error: error.message,
        message: 'Error verificando salud del módulo'
      };
    }
  }
}