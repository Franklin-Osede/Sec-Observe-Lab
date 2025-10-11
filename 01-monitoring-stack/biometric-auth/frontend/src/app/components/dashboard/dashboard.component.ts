import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgChartsModule } from 'ng2-charts';

import { MetricsService, MetricsData } from '../../services/metrics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgChartsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() metrics: MetricsData | null = null;
  @Input() isLoading: boolean = false;

  chartData: any = null;
  chartOptions: any = {};

  constructor(private metricsService: MetricsService) {}

  ngOnInit() {
    this.initializeChart();
  }

  private initializeChart() {
    this.chartData = {
      labels: ['WebAuthn', 'Fingerprint', 'Face', 'QR'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
        borderColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
        borderWidth: 2
      }]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };
  }

  getMetricValue(metric: string): number {
    if (!this.metrics) return 0;
    return (this.metrics as any)[metric] || 0;
  }

  getTotalAttempts(): number {
    if (!this.metrics) return 0;
    return this.getMetricValue('biometric_auth_attempts_total');
  }

  getSuccessRate(): number {
    const total = this.getTotalAttempts();
    if (total === 0) return 0;
    return Math.round((total / (total + 1)) * 100); // Simulado
  }
}
