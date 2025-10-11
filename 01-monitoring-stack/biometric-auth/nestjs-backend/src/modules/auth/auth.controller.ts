import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('status')
  @ApiOperation({
    summary: 'Estado de autenticación',
    description: 'Obtiene el estado actual del sistema de autenticación',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado obtenido exitosamente',
  })
  async getAuthStatus() {
    return this.authService.getAuthStatus();
  }
}
