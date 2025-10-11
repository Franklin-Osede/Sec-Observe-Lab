import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  GenerateRegistrationOptionsOpts,
  GenerateAuthenticationOptionsOpts,
  VerifyRegistrationResponseOpts,
  VerifyAuthenticationResponseOpts,
} from '@simplewebauthn/server';
import { WebauthnRegistrationDto } from './dto/webauthn-registration.dto';
import { WebauthnAuthenticationBeginDto, WebauthnAuthenticationCompleteDto } from './dto/webauthn-authentication.dto';

@Injectable()
export class WebauthnService {
  private readonly logger = new Logger(WebauthnService.name);
  private readonly rpName = 'Sec-Observe-Lab';
  private readonly rpID = 'localhost';
  private readonly origin = 'http://localhost:4202';

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async beginRegistration(registrationDto: WebauthnRegistrationDto) {
    try {
      const { username, displayName } = registrationDto;

      // Verificar si el usuario ya existe
      const existingUser = await this.redis.get(`webauthn:user:${username}`);
      if (existingUser) {
        throw new BadRequestException('Usuario ya registrado');
      }

      // Generar opciones de registro
      const options: GenerateRegistrationOptionsOpts = {
        rpName: this.rpName,
        rpID: this.rpID,
        userID: username,
        userName: username,
        userDisplayName: displayName,
        attestationType: 'direct',
        authenticatorSelection: {
          authenticatorAttachment: 'cross-platform',
          userVerification: 'discouraged',
          residentKey: 'discouraged',
        },
        supportedAlgorithmIDs: [-7, -257], // ES256, RS256
        timeout: 60000,
      };

      const registrationOptions = await generateRegistrationOptions(options);

      // Guardar challenge en Redis (sin recodificar)
      await this.redis.setex(
        `webauthn:challenge:${username}`,
        300, // 5 minutos
        registrationOptions.challenge
      );

      // Guardar datos del usuario
      await this.redis.setex(
        `webauthn:user:${username}`,
        3600, // 1 hora
        JSON.stringify({
          id: username,
          name: username,
          displayName,
          createdAt: new Date().toISOString(),
        })
      );

      this.logger.log(`Registro WebAuthn iniciado para usuario: ${username}`);

      return {
        ...registrationOptions,
        challenge: registrationOptions.challenge,
        user: {
          id: username,
          name: username,
          displayName,
        },
      };
    } catch (error) {
      this.logger.error(`Error iniciando registro WebAuthn: ${error.message}`);
      throw error;
    }
  }

  async completeRegistration(credential: any) {
    try {
      const { id, type, rawId, response } = credential;
      const { attestationObject, clientDataJSON } = response;

      // Obtener challenge del Redis
      const challenge = await this.redis.get(`webauthn:challenge:${credential.userID}`);
      if (!challenge) {
        throw new BadRequestException('Challenge no encontrado o expirado');
      }

      // Usar challenge directamente como string
      const challengeString = challenge;

      // Verificar respuesta de registro
      const verification = await verifyRegistrationResponse({
        response: {
          id,
          rawId,
          type,
          response: {
            attestationObject,
            clientDataJSON,
          },
          clientExtensionResults: {},
        },
        expectedChallenge: challengeString,
        expectedOrigin: this.origin,
        expectedRPID: this.rpID,
      });

      if (!verification.verified) {
        throw new BadRequestException('Verificación de registro fallida');
      }

      // Guardar credencial
      const credentialData = {
        id,
        type,
        rawId,
        publicKey: verification.registrationInfo?.credentialPublicKey,
        counter: verification.registrationInfo?.counter,
        transports: credential.transports || [],
        createdAt: new Date().toISOString(),
      };

      await this.redis.setex(
        `webauthn:credential:${id}`,
        86400, // 24 horas
        JSON.stringify(credentialData)
      );

      // Agregar credencial al usuario
      const userKey = `webauthn:user:${credential.userID}`;
      const userData = JSON.parse(await this.redis.get(userKey));
      userData.credentials = userData.credentials || [];
      userData.credentials.push(id);
      await this.redis.setex(userKey, 3600, JSON.stringify(userData));

      // Limpiar challenge
      await this.redis.del(`webauthn:challenge:${credential.userID}`);

      this.logger.log(`Registro WebAuthn completado para usuario: ${credential.userID}`);

      // Incrementar métricas
      await this.redis.incr('webauthn_registration_total');
      await this.redis.incr('biometric_auth_attempts_total');

      return {
        success: true,
        message: 'Registro WebAuthn completado exitosamente',
        credentialId: id,
      };
    } catch (error) {
      this.logger.error(`Error completando registro WebAuthn: ${error.message}`);
      throw error;
    }
  }

  async beginAuthentication(authenticationDto: WebauthnAuthenticationBeginDto) {
    try {
      const { username } = authenticationDto;

      // Verificar si el usuario existe
      const userData = await this.redis.get(`webauthn:user:${username}`);
      if (!userData) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const user = JSON.parse(userData);
      const credentials = user.credentials || [];

      // Obtener credenciales del usuario
      const userCredentials = [];
      for (const credentialId of credentials) {
        const credentialData = await this.redis.get(`webauthn:credential:${credentialId}`);
        if (credentialData) {
          const credential = JSON.parse(credentialData);
          userCredentials.push({
            id: credential.id,
            type: credential.type,
            transports: credential.transports,
          });
        }
      }

      if (userCredentials.length === 0) {
        throw new BadRequestException('No hay credenciales registradas para este usuario');
      }

      // Generar opciones de autenticación
      const options: GenerateAuthenticationOptionsOpts = {
        rpID: this.rpID,
        allowCredentials: userCredentials,
        userVerification: 'discouraged',
        timeout: 60000,
      };

      const authenticationOptions = await generateAuthenticationOptions(options);

      // Guardar challenge en Redis
      await this.redis.setex(
        `webauthn:auth:challenge:${username}`,
        300, // 5 minutos
        authenticationOptions.challenge
      );

      this.logger.log(`Autenticación WebAuthn iniciada para usuario: ${username}`);

      return authenticationOptions;
    } catch (error) {
      this.logger.error(`Error iniciando autenticación WebAuthn: ${error.message}`);
      throw error;
    }
  }

  async completeAuthentication(assertion: any) {
    try {
      const { id, type, rawId, response } = assertion;
      const { authenticatorData, clientDataJSON, signature, userHandle } = response;

      // Obtener challenge del Redis
      const challenge = await this.redis.get(`webauthn:auth:challenge:${userHandle}`);
      if (!challenge) {
        throw new BadRequestException('Challenge de autenticación no encontrado o expirado');
      }

      // Obtener credencial
      const credentialData = await this.redis.get(`webauthn:credential:${id}`);
      if (!credentialData) {
        throw new BadRequestException('Credencial no encontrada');
      }

      const credential = JSON.parse(credentialData);

      // Verificar respuesta de autenticación
      const verification = await verifyAuthenticationResponse({
        response: {
          id,
          rawId,
          type,
          response: {
            authenticatorData,
            clientDataJSON,
            signature,
            userHandle,
          },
          clientExtensionResults: {},
        },
        expectedChallenge: challenge,
        expectedOrigin: this.origin,
        expectedRPID: this.rpID,
        authenticator: {
          credentialID: credential.id,
          credentialPublicKey: credential.publicKey,
          counter: credential.counter,
        },
      });

      if (!verification.verified) {
        throw new BadRequestException('Verificación de autenticación fallida');
      }

      // Actualizar contador
      credential.counter = verification.authenticationInfo.newCounter;
      await this.redis.setex(
        `webauthn:credential:${id}`,
        86400,
        JSON.stringify(credential)
      );

      // Limpiar challenge
      await this.redis.del(`webauthn:auth:challenge:${userHandle}`);

      this.logger.log(`Autenticación WebAuthn completada para usuario: ${userHandle}`);

      return {
        success: true,
        message: 'Autenticación WebAuthn exitosa',
        user: userHandle,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error completando autenticación WebAuthn: ${error.message}`);
      throw error;
    }
  }

  async getUserCredentials(username: string) {
    try {
      const userData = await this.redis.get(`webauthn:user:${username}`);
      if (!userData) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const user = JSON.parse(userData);
      const credentials = user.credentials || [];

      const userCredentials = [];
      for (const credentialId of credentials) {
        const credentialData = await this.redis.get(`webauthn:credential:${credentialId}`);
        if (credentialData) {
          const credential = JSON.parse(credentialData);
          userCredentials.push({
            id: credential.id,
            type: credential.type,
            transports: credential.transports,
            createdAt: credential.createdAt,
          });
        }
      }

      return userCredentials;
    } catch (error) {
      this.logger.error(`Error obteniendo credenciales del usuario: ${error.message}`);
      throw error;
    }
  }

  async getHealth() {
    try {
      // Verificar conexión a Redis
      await this.redis.ping();

      return {
        status: 'healthy',
        module: 'webauthn',
        timestamp: new Date().toISOString(),
        redis: 'connected',
      };
    } catch (error) {
      this.logger.error(`Error verificando salud del módulo WebAuthn: ${error.message}`);
      return {
        status: 'unhealthy',
        module: 'webauthn',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }
}
