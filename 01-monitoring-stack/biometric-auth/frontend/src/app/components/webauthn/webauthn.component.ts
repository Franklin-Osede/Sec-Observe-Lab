import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { BiometricService, BiometricResult } from '../../services/biometric.service';

@Component({
  selector: 'app-webauthn',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule
  ],
  templateUrl: './webauthn.component.html',
  styleUrls: ['./webauthn.component.scss']
})
export class WebauthnComponent implements OnInit {
  @Input() username: string = '';
  @Output() statusChange = new EventEmitter<BiometricResult>();

  isLoading: boolean = false;
  isWebAuthnSupported: boolean = false;
  currentStatus: BiometricResult | null = null;
  biometricSupport: any = {};

  registrationData = {
    displayName: ''
  };

  registrationChallenge: any = null;
  authenticationChallenge: any = null;

  constructor(
    private biometricService: BiometricService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.isWebAuthnSupported = this.biometricService.isWebAuthnSupported();
    this.biometricSupport = await this.biometricService.checkBiometricSupport();
    
    if (this.username) {
      this.registrationData.displayName = this.username;
    }
  }

  async beginRegistration() {
    if (!this.username) {
      this.snackBar.open('❌ Usuario requerido', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    try {
      const result = await this.biometricService.beginWebAuthnRegistration(
        this.username, 
        this.registrationData.displayName
      );
      
      this.currentStatus = result;
      this.statusChange.emit(result);
      
      if (result.success) {
        this.registrationChallenge = result.data;
        this.snackBar.open('✅ Registro iniciado', 'Cerrar', { duration: 3000 });
      } else {
        this.snackBar.open(`❌ Error: ${result.error}`, 'Cerrar', { duration: 5000 });
      }
    } catch (error: any) {
      this.snackBar.open(`❌ Error: ${error.message}`, 'Cerrar', { duration: 5000 });
    } finally {
      this.isLoading = false;
    }
  }

  async completeRegistration() {
    if (!this.registrationChallenge) {
      this.snackBar.open('❌ No hay registro iniciado', 'Cerrar', { duration: 3000 });
      return;
    }

    console.log('Registration Challenge completo:', this.registrationChallenge);
    console.log('Challenge específico:', this.registrationChallenge.challenge);

    this.isLoading = true;
    try {
      // Crear credencial usando WebAuthn API del navegador
      const credential = await this.biometricService.createWebAuthnCredential(
        this.registrationChallenge.data.challenge,
        this.registrationChallenge.data.user
      );

      const result = await this.biometricService.completeWebAuthnRegistration(credential, this.username);
      
      this.currentStatus = result;
      this.statusChange.emit(result);
      
      if (result.success) {
        this.snackBar.open('✅ Registro completado', 'Cerrar', { duration: 3000 });
        this.registrationChallenge = null;
      } else {
        this.snackBar.open(`❌ Error: ${result.error}`, 'Cerrar', { duration: 5000 });
      }
    } catch (error: any) {
      this.snackBar.open(`❌ Error: ${error.message}`, 'Cerrar', { duration: 5000 });
    } finally {
      this.isLoading = false;
    }
  }

  async beginAuthentication() {
    if (!this.username) {
      this.snackBar.open('❌ Usuario requerido', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    try {
      const result = await this.biometricService.beginWebAuthnAuthentication(this.username);
      
      this.currentStatus = result;
      this.statusChange.emit(result);
      
      if (result.success) {
        this.authenticationChallenge = result.data;
        this.snackBar.open('✅ Autenticación iniciada', 'Cerrar', { duration: 3000 });
      } else {
        this.snackBar.open(`❌ Error: ${result.error}`, 'Cerrar', { duration: 5000 });
      }
    } catch (error: any) {
      this.snackBar.open(`❌ Error: ${error.message}`, 'Cerrar', { duration: 5000 });
    } finally {
      this.isLoading = false;
    }
  }

  async completeAuthentication() {
    if (!this.authenticationChallenge) {
      this.snackBar.open('❌ No hay autenticación iniciada', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    try {
      // Obtener aserción usando WebAuthn API del navegador
      const assertion = await this.biometricService.getWebAuthnAssertion(
        this.authenticationChallenge.data.challenge,
        this.authenticationChallenge.data.allowCredentials || []
      );

      const result = await this.biometricService.completeWebAuthnAuthentication(assertion);
      
      this.currentStatus = result;
      this.statusChange.emit(result);
      
      if (result.success) {
        this.snackBar.open('✅ Autenticación exitosa', 'Cerrar', { duration: 3000 });
        this.authenticationChallenge = null;
      } else {
        this.snackBar.open(`❌ Error: ${result.error}`, 'Cerrar', { duration: 5000 });
      }
    } catch (error: any) {
      this.snackBar.open(`❌ Error: ${error.message}`, 'Cerrar', { duration: 5000 });
    } finally {
      this.isLoading = false;
    }
  }
}
