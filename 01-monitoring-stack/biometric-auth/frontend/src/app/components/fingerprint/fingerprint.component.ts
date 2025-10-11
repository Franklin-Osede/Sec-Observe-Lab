import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { BiometricService, BiometricResult } from '../../services/biometric.service';

@Component({
  selector: 'app-fingerprint',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './fingerprint.component.html',
  styleUrls: ['./fingerprint.component.scss']
})
export class FingerprintComponent implements OnInit {
  @Input() username: string = '';
  @Output() statusChange = new EventEmitter<BiometricResult>();

  isLoading: boolean = false;
  currentStatus: BiometricResult | null = null;

  constructor(
    private biometricService: BiometricService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.username) {
      console.log('Fingerprint component initialized for:', this.username);
    }
  }

  async testFingerprint() {
    if (!this.username) {
      this.snackBar.open('❌ Usuario requerido', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    try {
      const result = await this.biometricService.recognizeFingerprint(
        this.username, 
        `fingerprint-${Date.now()}`
      );
      
      this.currentStatus = result;
      this.statusChange.emit(result);
      
      if (result.success) {
        this.snackBar.open('✅ Huella reconocida correctamente', 'Cerrar', { duration: 3000 });
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
