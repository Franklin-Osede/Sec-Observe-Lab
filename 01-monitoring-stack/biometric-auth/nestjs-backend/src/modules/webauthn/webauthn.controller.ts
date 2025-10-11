import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { WebauthnService } from './webauthn.service';
import { WebauthnRegistrationDto } from './dto/webauthn-registration.dto';
import { WebauthnAuthenticationBeginDto, WebauthnAuthenticationCompleteDto } from './dto/webauthn-authentication.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('webauthn')
@Controller('webauthn')
@UseGuards(ThrottlerGuard)
export class WebauthnController {
  constructor(private readonly webauthnService: WebauthnService) {}

  @Post('register/begin')
  @HttpCode(HttpStatus.OK)
  // @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Iniciar registro WebAuthn',
    description: 'Inicia el proceso de registro WebAuthn para un usuario',
  })
  @ApiBody({ type: WebauthnRegistrationDto })
  @ApiResponse({
    status: 200,
    description: 'Registro WebAuthn iniciado exitosamente',
    schema: {
      type: 'object',
      properties: {
        challenge: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            displayName: { type: 'string' },
          },
        },
        rp: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            id: { type: 'string' },
          },
        },
        pubKeyCredParams: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              alg: { type: 'number' },
            },
          },
        },
        authenticatorSelection: {
          type: 'object',
          properties: {
            authenticatorAttachment: { type: 'string' },
            userVerification: { type: 'string' },
          },
        },
        timeout: { type: 'number' },
        attestation: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 429,
    description: 'Demasiadas solicitudes',
  })
  async beginRegistration(@Body() registrationDto: WebauthnRegistrationDto) {
    return this.webauthnService.beginRegistration(registrationDto);
  }

  @Post('register/complete')
  @HttpCode(HttpStatus.OK)
  // @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Completar registro WebAuthn',
    description: 'Completa el proceso de registro WebAuthn con la credencial del usuario',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        credential: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string' },
            rawId: { type: 'string' },
            response: {
              type: 'object',
              properties: {
                attestationObject: { type: 'string' },
                clientDataJSON: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Registro WebAuthn completado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        credentialId: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Credencial inválida',
  })
  async completeRegistration(@Body() body: { credential: any }) {
    return this.webauthnService.completeRegistration(body.credential);
  }

  @Post('authenticate/begin')
  @HttpCode(HttpStatus.OK)
  // @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({
    summary: 'Iniciar autenticación WebAuthn',
    description: 'Inicia el proceso de autenticación WebAuthn para un usuario',
  })
  @ApiBody({ type: WebauthnAuthenticationBeginDto })
  @ApiResponse({
    status: 200,
    description: 'Autenticación WebAuthn iniciada exitosamente',
    schema: {
      type: 'object',
      properties: {
        challenge: { type: 'string' },
        allowCredentials: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              type: { type: 'string' },
              transports: { type: 'array', items: { type: 'string' } },
            },
          },
        },
        timeout: { type: 'number' },
        userVerification: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async beginAuthentication(@Body() authenticationDto: WebauthnAuthenticationBeginDto) {
    return this.webauthnService.beginAuthentication(authenticationDto);
  }

  @Post('authenticate/complete')
  @HttpCode(HttpStatus.OK)
  // @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({
    summary: 'Completar autenticación WebAuthn',
    description: 'Completa el proceso de autenticación WebAuthn con la aserción del usuario',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        assertion: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string' },
            rawId: { type: 'string' },
            response: {
              type: 'object',
              properties: {
                authenticatorData: { type: 'string' },
                clientDataJSON: { type: 'string' },
                signature: { type: 'string' },
                userHandle: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Autenticación WebAuthn completada exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        user: { type: 'string' },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Aserción inválida',
  })
  async completeAuthentication(@Body() body: { assertion: any }) {
    return this.webauthnService.completeAuthentication(body.assertion);
  }

  @Get('users/:username/credentials')
  @ApiOperation({
    summary: 'Obtener credenciales del usuario',
    description: 'Obtiene todas las credenciales WebAuthn registradas para un usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Credenciales obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          transports: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string' },
        },
      },
    },
  })
  async getUserCredentials(@Param('username') username: string) {
    return this.webauthnService.getUserCredentials(username);
  }

  @Get('health')
  @ApiOperation({
    summary: 'Salud del módulo WebAuthn',
    description: 'Verifica el estado del módulo WebAuthn',
  })
  @ApiResponse({
    status: 200,
    description: 'Módulo WebAuthn saludable',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        module: { type: 'string' },
        timestamp: { type: 'string' },
      },
    },
  })
  async getHealth() {
    return this.webauthnService.getHealth();
  }
}
