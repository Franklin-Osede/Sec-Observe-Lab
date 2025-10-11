import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Verificar salud del sistema',
    description: 'Verifica el estado de salud del sistema y sus dependencias',
  })
  @ApiResponse({
    status: 200,
    description: 'Sistema saludable',
  })
  async getHealth() {
    return this.healthService.getHealth();
  }
}
