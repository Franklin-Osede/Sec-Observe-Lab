import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { BiometricService, MetricsService } from './services';
import { WebauthnComponent } from './components/webauthn/webauthn.component';
import { FingerprintComponent } from './components/fingerprint/fingerprint.component';
import { FaceRecognitionComponent } from './components/face-recognition/face-recognition.component';
import { QrCodeComponent } from './components/qr-code/qr-code.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    WebauthnComponent,
    FingerprintComponent,
    FaceRecognitionComponent,
    QrCodeComponent,
    DashboardComponent
  ],
  template: `
    <div class="app-container">
      <!-- Header -->
      <mat-toolbar color="primary" class="app-header">
        <mat-icon>security</mat-icon>
        <span class="app-title">🔐 Sec-Observe-Lab</span>
        <span class="app-subtitle">Autenticación Biométrica</span>
        
        <div class="spacer"></div>
        
        <button mat-icon-button (click)="checkSystemHealth()" 
                [disabled]="isLoading" 
                matTooltip="Verificar Salud del Sistema">
          <mat-icon>health_and_safety</mat-icon>
        </button>
        
        <button mat-icon-button (click)="refreshMetrics()" 
                [disabled]="isLoading" 
                matTooltip="Actualizar Métricas">
          <mat-icon>refresh</mat-icon>
        </button>
      </mat-toolbar>

      <!-- Main Content -->
      <div class="main-content">
        <div class="container">
          <!-- User Input Section -->
          <mat-card class="user-section">
            <mat-card-header>
              <mat-card-title>👤 Usuario</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <input 
                type="text" 
                [(ngModel)]="currentUser" 
                placeholder="Ingresa tu nombre de usuario" 
                class="user-input"
                (ngModelChange)="onUserChange()">
            </mat-card-content>
          </mat-card>

          <!-- Biometric Tests Tabs -->
          <mat-card class="tests-section">
            <mat-tab-group>
              <!-- WebAuthn Tab -->
              <mat-tab label="🔑 WebAuthn">
                <ng-template matTabContent>
                  <app-webauthn 
                    [username]="currentUser"
                    (statusChange)="onBiometricStatusChange('WebAuthn', $event)">
                  </app-webauthn>
                </ng-template>
              </mat-tab>

              <!-- Fingerprint Tab -->
              <mat-tab label="👆 Huella">
                <ng-template matTabContent>
                  <app-fingerprint 
                    [username]="currentUser"
                    (statusChange)="onBiometricStatusChange('Fingerprint', $event)">
                  </app-fingerprint>
                </ng-template>
              </mat-tab>

              <!-- Face Recognition Tab -->
              <mat-tab label="📷 Rostro">
                <ng-template matTabContent>
                  <app-face-recognition 
                    [username]="currentUser"
                    (statusChange)="onBiometricStatusChange('Face', $event)">
                  </app-face-recognition>
                </ng-template>
              </mat-tab>

              <!-- QR Code Tab -->
              <mat-tab label="📱 QR">
                <ng-template matTabContent>
                  <app-qr-code 
                    [username]="currentUser"
                    (statusChange)="onBiometricStatusChange('QR', $event)">
                  </app-qr-code>
                </ng-template>
              </mat-tab>

              <!-- Dashboard Tab -->
              <mat-tab label="📊 Dashboard">
                <ng-template matTabContent>
                  <app-dashboard 
                    [metrics]="metrics"
                    [isLoading]="isLoading">
                  </app-dashboard>
                </ng-template>
              </mat-tab>
            </mat-tab-group>
          </mat-card>

          <!-- System Status -->
          <mat-card class="status-section" *ngIf="systemStatus">
            <mat-card-header>
              <mat-card-title>🏥 Estado del Sistema</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="status-grid">
                <div class="status-item" [class.success]="systemStatus.redis">
                  <mat-icon>storage</mat-icon>
                  <span>Redis: {{ systemStatus.redis ? 'OK' : 'Error' }}</span>
                </div>
                <div class="status-item" [class.success]="systemStatus.uptime">
                  <mat-icon>schedule</mat-icon>
                  <span>Uptime: {{ systemStatus.uptime || 'N/A' }}</span>
                </div>
                <div class="status-item" [class.success]="!isLoading">
                  <mat-icon>check_circle</mat-icon>
                  <span>Sistema: {{ isLoading ? 'Cargando...' : 'Activo' }}</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div class="loading-overlay" *ngIf="isLoading">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Cargando...</p>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: var(--background-gradient);
    }

    .app-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .app-title {
      font-size: 1.5em;
      font-weight: bold;
      margin-left: 10px;
    }

    .app-subtitle {
      font-size: 0.9em;
      opacity: 0.8;
      margin-left: 10px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .main-content {
      padding: 2rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .user-section {
      margin-bottom: 2rem;
    }

    .tests-section {
      margin-bottom: 2rem;
    }

    .status-section {
      margin-bottom: 2rem;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-radius: 10px;
      background: #f5f5f5;
      transition: var(--transition);
    }

    .status-item.success {
      background: #d4edda;
      color: #155724;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      color: white;
    }

    .loading-overlay p {
      margin-top: 1rem;
      font-size: 1.1em;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 1rem;
      }
      
      .app-title {
        font-size: 1.2em;
      }
      
      .app-subtitle {
        display: none;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  currentUser: string = 'testuser';
  isLoading: boolean = false;
  systemStatus: any = null;
  metrics: any = null;

  constructor(
    private biometricService: BiometricService,
    private metricsService: MetricsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.checkSystemHealth();
    this.refreshMetrics();
  }

  onUserChange() {
    console.log('Usuario cambiado:', this.currentUser);
    this.refreshMetrics();
  }

  onBiometricStatusChange(method: string, status: any) {
    console.log(`Estado ${method}:`, status);
    
    if (status.success) {
      this.snackBar.open(`✅ ${method} exitoso`, 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    } else {
      this.snackBar.open(`❌ ${method} falló: ${status.error}`, 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
  }

  async checkSystemHealth() {
    this.isLoading = true;
    try {
      this.systemStatus = await this.biometricService.checkHealth();
      this.snackBar.open('✅ Sistema verificado', 'Cerrar', {
        duration: 2000
      });
    } catch (error) {
      this.snackBar.open(`❌ Error verificando sistema: ${error}`, 'Cerrar', {
        duration: 5000
      });
    } finally {
      this.isLoading = false;
    }
  }

  async refreshMetrics() {
    this.isLoading = true;
    try {
      this.metrics = await this.metricsService.getMetrics();
    } catch (error) {
      console.error('Error obteniendo métricas:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
