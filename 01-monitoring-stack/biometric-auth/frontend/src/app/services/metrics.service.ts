import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface MetricsData {
  biometric_auth_attempts_total: number;
  biometric_auth_duration_seconds: number;
  webauthn_registration_total: number;
  webauthn_authentication_total: number;
  fingerprint_recognition_total: number;
  face_recognition_total: number;
  qr_code_generation_total: number;
  qr_code_validation_total: number;
  system_uptime: number;
  redis_connections: number;
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private readonly API_BASE = 'http://localhost:3001/api/v1';
  private readonly PROMETHEUS_BASE = 'http://localhost:9090/api/v1';
  
  private metricsSubject = new BehaviorSubject<MetricsData | null>(null);
  public metrics$ = this.metricsSubject.asObservable();

  constructor(private http: HttpClient) {}

  async getMetrics(): Promise<MetricsData> {
    try {
      const response = await this.http.get(`${this.API_BASE}/metrics`).toPromise();
      
      // Si la respuesta es un string, parsearlo como métricas Prometheus
      if (typeof response === 'string') {
        return this.parseMetrics(response);
      }
      
      // Si la respuesta es un objeto, devolver métricas por defecto
      return this.getDefaultMetrics();
    } catch (error: any) {
      console.error('Error obteniendo métricas:', error);
      return this.getDefaultMetrics();
    }
  }

  private parseMetrics(metricsText: string): MetricsData {
    const lines = metricsText.split('\n');
    const metrics: any = {};

    lines.forEach(line => {
      if (line.startsWith('#') || line.trim() === '') return;

      const [metricName, value] = line.split(' ');
      if (metricName && value) {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          metrics[metricName] = numericValue;
        }
      }
    });

    return {
      biometric_auth_attempts_total: metrics.biometric_auth_attempts_total || 0,
      biometric_auth_duration_seconds: metrics.biometric_auth_duration_seconds || 0,
      webauthn_registration_total: metrics.webauthn_registration_total || 0,
      webauthn_authentication_total: metrics.webauthn_authentication_total || 0,
      fingerprint_recognition_total: metrics.fingerprint_recognition_total || 0,
      face_recognition_total: metrics.face_recognition_total || 0,
      qr_code_generation_total: metrics.qr_code_generation_total || 0,
      qr_code_validation_total: metrics.qr_code_validation_total || 0,
      system_uptime: metrics.system_uptime || 0,
      redis_connections: metrics.redis_connections || 0
    };
  }

  private getDefaultMetrics(): MetricsData {
    return {
      biometric_auth_attempts_total: 0,
      biometric_auth_duration_seconds: 0,
      webauthn_registration_total: 0,
      webauthn_authentication_total: 0,
      fingerprint_recognition_total: 0,
      face_recognition_total: 0,
      qr_code_generation_total: 0,
      qr_code_validation_total: 0,
      system_uptime: 0,
      redis_connections: 0
    };
  }

  async refreshMetrics(): Promise<void> {
    try {
      const metrics = await this.getMetrics();
      this.metricsSubject.next(metrics);
    } catch (error) {
      console.error('Error actualizando métricas:', error);
    }
  }
}