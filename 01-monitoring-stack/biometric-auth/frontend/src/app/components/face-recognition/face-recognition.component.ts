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
  selector: 'app-face-recognition',
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
  templateUrl: './face-recognition.component.html',
  styleUrls: ['./face-recognition.component.scss']
})
export class FaceRecognitionComponent implements OnInit {
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
      console.log('Face recognition component initialized for:', this.username);
    }
    console.log('🔄 AUTO-RELOAD TEST - Face Recognition component loaded!');
  }

  async testFaceRecognition() {
    if (!this.username) {
      this.snackBar.open('❌ Usuario requerido', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    try {
      const result = await this.biometricService.recognizeFace(
        this.username, 
        `face-${Date.now()}`
      );
      
      this.currentStatus = result;
      this.statusChange.emit(result);
      
      if (result.success) {
        this.snackBar.open('✅ Rostro reconocido correctamente', 'Cerrar', { duration: 3000 });
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
