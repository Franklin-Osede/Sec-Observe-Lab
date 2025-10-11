import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface BiometricResult {
  success: boolean;
  data?: any;
  error?: string;
  method: string;
  timestamp: Date;
}

export interface WebAuthnCredential {
  id: string;
  type: string;
  rawId: string;
  response: {
    attestationObject: string;
    clientDataJSON: string;
  };
}

export interface WebAuthnAssertion {
  id: string;
  type: string;
  rawId: string;
  response: {
    authenticatorData: string;
    clientDataJSON: string;
    signature: string;
    userHandle: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BiometricService {
  private readonly API_BASE = 'http://localhost:3001/api/v1';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private statusSubject = new BehaviorSubject<BiometricResult | null>(null);
  public status$ = this.statusSubject.asObservable();

  constructor(private http: HttpClient) {}

  // WebAuthn Methods
  async beginWebAuthnRegistration(username: string, displayName: string): Promise<BiometricResult> {
    try {
      const response = await this.http.post(`${this.API_BASE}/webauthn/register/begin`, {
        username,
        displayName
      }, this.httpOptions).toPromise();

      const result: BiometricResult = {
        success: true,
        data: response,
        method: 'WebAuthn Registration',
        timestamp: new Date()
      };

      this.statusSubject.next(result);
      return result;
    } catch (error: any) {
      const result: BiometricResult = {
        success: false,
        error: error.message || 'Error en registro WebAuthn',
        method: 'WebAuthn Registration',
        timestamp: new Date()
      };

      this.statusSubject.next(result);
      return result;
    }
  }

  async completeWebAuthnRegistration(credential: WebAuthnCredential, username?: string): Promise<BiometricResult> {
    try {
      const response = await this.http.post(`${this.API_BASE}/webauthn/register/complete`, {
        credential: {
          ...credential,
          userID: username || 'testuser'
        }
      }, this.httpOptions).toPromise();

      const result: BiometricResult = {
        success: true,
        data: response,
        method: 'WebAuthn Registration Complete',
        timestamp: new Date()
      };

      this.statusSubject.next(result);
      return result;
    } catch (error: any) {
      const result: BiometricResult = {
        success: false,
        error: error.message || 'Error completando registro WebAuthn',
        method: 'WebAuthn Registration Complete',
        timestamp: new Date()
      };

      this.statusSubject.next(result);
      return result;
    }
  }

  async beginWebAuthnAuthentication(username: string): Promise<BiometricResult> {
    try {
      const response = await this.http.post(`${this.API_BASE}/webauthn/authenticate/begin`, {
        username
      }, this.httpOptions).toPromise();

      const result: BiometricResult = {
        success: true,
        data: response,
        method: 'WebAuthn Authentication',
        timestamp: new Date()
      };

      this.statusSubject.next(result);
      return result;
    } catch (error: any) {
      const result: BiometricResult = {
        success: false,
        error: error.message || 'Error en autenticación WebAuthn',
        method: 'WebAuthn Authentication',
        timestamp: new Date()
      };

      this.statusSubject.next(result);
      return result;
    }
  }

  async completeWebAuthnAuthentication(assertion: WebAuthnAssertion): Promise<BiometricResult> {
    try {
      const response = await this.http.post(`${this.API_BASE}/webauthn/authenticate/complete`, {
        assertion
      }, this.httpOptions).toPromise();

      const result: BiometricResult = {
        success: true,
        data: response,
        method: 'WebAuthn Authentication Complete',
        timestamp: new Date()
      };

      this.statusSubject.next(result);
      return result;
    } catch (error: any) {
      const result: BiometricResult = {
        success: false,
        error: error.message || 'Error completando autenticación WebAuthn',
        method: 'WebAuthn Authentication Complete',
        timestamp: new Date()
      };

      this.statusSubject.next(result);
      return result;
    }
  }

  // Fingerprint Methods
  async recognizeFingerprint(username: string, fingerprintData: string): Promise<BiometricResult> {
    try {
      const response = await this.http.post(`${this.API_BASE}/fingerprint/recognize`, {
        username,
        fingerprintData
      }, this.httpOptions).toPromise();

      const result: BiometricResult = {
        success: true,
        data: response,
        method: 'Fingerprint Recognition',
        timestamp: new Date()
      };

      this.statusSubject.next(result);
      return result;
    } catch (error: any) {
      const result: BiometricResult = {
        success: false,
        error: error.message || 'Error en reconocimiento de huella',
        method: 'Fingerprint Recognition',
        timestamp: new Date()
      };

      this.statusSubject.next(result);
      return result;
    }
  }

  // Face Recognition Methods
  async recognizeFace(username: string, faceData: string): Promise<BiometricResult> {
    try {
      const response = await this.http.post(`${this.API_BASE}/face/recognize`, {
        username,
        faceData
      }, this.httpOptions).toPromise();

      const result: BiometricResult = {
        success: true,
        data: response,
        method: 'Face Recognition',
        timestamp: new Date()
      };

      this.statusSubject.next(result);
      return result;
    } catch (error: any) {
      const result: BiometricResult = {
        success: false,
        error: error.message || 'Error en reconocimiento facial',
        method: 'Face Recognition',
        timestamp: new Date()
      };

      this.statusSubject.next(result);
      return result;
    }
  }

  // QR Code Methods
  async generateQRCode(username: string, data: string): Promise<BiometricResult> {
    try {
      const response = await this.http.post(`${this.API_BASE}/qr/generate`, {
        username,
        data
      }, this.httpOptions).toPromise();

      const result: BiometricResult = {
        success: true,
        data: response,
        method: 'QR Code Generation',
        timestamp: new Date()
      };

      this.statusSubject.next(result);
      return result;
    } catch (error: any) {
      const result: BiometricResult = {
        success: false,
        error: error.message || 'Error generando código QR',
        method: 'QR Code Generation',
        timestamp: new Date()
      };

      this.statusSubject.next(result);
      return result;
    }
  }

  async validateQRCode(username: string, qrData: string): Promise<BiometricResult> {
    try {
      const response = await this.http.post(`${this.API_BASE}/qr/validate`, {
        username,
        qrData
      }, this.httpOptions).toPromise();

      const result: BiometricResult = {
        success: true,
        data: response,
        method: 'QR Code Validation',
        timestamp: new Date()
      };

      this.statusSubject.next(result);
      return result;
    } catch (error: any) {
      const result: BiometricResult = {
        success: false,
        error: error.message || 'Error validando código QR',
        method: 'QR Code Validation',
        timestamp: new Date()
      };

      this.statusSubject.next(result);
      return result;
    }
  }

  // System Health
  async checkHealth(): Promise<any> {
    try {
      const response = await this.http.get(`${this.API_BASE}/health`, this.httpOptions).toPromise();
      return response;
    } catch (error: any) {
      throw new Error(`Error verificando salud del sistema: ${error.message}`);
    }
  }

  // WebAuthn Browser API Integration
  async createWebAuthnCredential(challenge: string, user: any): Promise<WebAuthnCredential> {
    try {
      console.log('Challenge recibido:', challenge);
      console.log('Tipo de challenge:', typeof challenge);
      console.log('Longitud del challenge:', challenge.length);
      
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: this.base64urlToArrayBuffer(challenge),
          rp: {
            name: "Sec-Observe-Lab",
            id: "localhost"
          },
          user: {
            id: new TextEncoder().encode(user.id),
            name: user.name,
            displayName: user.displayName
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 }, // ES256
            { type: "public-key", alg: -257 } // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "preferred"
          },
          timeout: 60000,
          attestation: "direct"
        }
      }) as PublicKeyCredential;

      return {
        id: credential.id,
        type: credential.type,
        rawId: this.arrayBufferToBase64URL(credential.rawId),
        response: {
          attestationObject: this.arrayBufferToBase64URL((credential.response as AuthenticatorAttestationResponse).attestationObject),
          clientDataJSON: this.arrayBufferToBase64URL(credential.response.clientDataJSON)
        }
      };
    } catch (error: any) {
      throw new Error(`Error creando credencial WebAuthn: ${error.message}`);
    }
  }

  async getWebAuthnAssertion(challenge: string, allowCredentials: any[]): Promise<WebAuthnAssertion> {
    try {
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: this.base64urlToArrayBuffer(challenge),
          allowCredentials: allowCredentials.map(cred => ({
            id: this.base64urlToArrayBuffer(cred.id),
            type: "public-key",
            transports: ["internal", "usb", "nfc", "ble"]
          })),
          timeout: 60000,
          userVerification: "preferred"
        }
      }) as PublicKeyCredential;

      return {
        id: assertion.id,
        type: assertion.type,
        rawId: this.arrayBufferToBase64URL(assertion.rawId),
        response: {
          authenticatorData: this.arrayBufferToBase64URL((assertion.response as AuthenticatorAssertionResponse).authenticatorData),
          clientDataJSON: this.arrayBufferToBase64URL(assertion.response.clientDataJSON),
          signature: this.arrayBufferToBase64URL((assertion.response as AuthenticatorAssertionResponse).signature),
          userHandle: this.arrayBufferToBase64URL((assertion.response as AuthenticatorAssertionResponse).userHandle || new ArrayBuffer(0))
        }
      };
    } catch (error: any) {
      throw new Error(`Error obteniendo aserción WebAuthn: ${error.message}`);
    }
  }

  // Utility Methods
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    try {
      // Limpiar el string base64 de caracteres no válidos
      const cleanBase64 = base64.replace(/[^A-Za-z0-9+/=]/g, '');
      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (error: any) {
      console.error('Error decodificando base64:', error);
      console.error('Base64 recibido:', base64);
      throw new Error(`Error decodificando challenge: ${error.message || error}`);
    }
  }

  // Helper to convert Base64URL to ArrayBuffer
  private base64urlToArrayBuffer(base64url: string): ArrayBuffer {
    try {
      // Convert base64url to base64
      const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if needed
      const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
      return this.base64ToArrayBuffer(padded);
    } catch (error: any) {
      console.error('Error decodificando base64url:', error);
      console.error('Base64URL recibido:', base64url);
      throw new Error(`Error decodificando challenge base64url: ${error.message || error}`);
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private arrayBufferToBase64URL(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  // Check WebAuthn Support
  isWebAuthnSupported(): boolean {
    return !!(navigator.credentials && 
              typeof navigator.credentials.create === 'function' && 
              typeof navigator.credentials.get === 'function');
  }

  // Check Biometric Support
  async checkBiometricSupport(): Promise<{ fingerprint: boolean; face: boolean; webauthn: boolean }> {
    return {
      fingerprint: 'TouchID' in window || 'FingerprintJS' in window,
      face: 'FaceID' in window || 'FaceRecognition' in window,
      webauthn: this.isWebAuthnSupported()
    };
  }
}
