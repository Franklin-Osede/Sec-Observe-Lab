import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  async getAuthStatus() {
    return {
      status: 'active',
      timestamp: new Date().toISOString(),
      methods: ['webauthn', 'fingerprint', 'face', 'qr'],
      version: '1.0.0'
    };
  }
}
