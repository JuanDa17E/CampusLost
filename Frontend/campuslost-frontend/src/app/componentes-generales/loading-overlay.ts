import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-backdrop" *ngIf="loading.activo()">
      <div class="loading-box">
        <div class="loading-spinner"></div>
        <p class="loading-texto">Cargando...</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .loading-box {
      background: #fff;
      border-radius: 16px;
      padding: 2rem 2.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      border: 0.5px solid rgba(0,0,0,0.08);
    }

    .loading-spinner {
      width: 44px;
      height: 44px;
      border: 3px solid #E6F1FB;
      border-top-color: #185FA5;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-texto {
      font-size: 14px;
      font-weight: 500;
      color: #185FA5;
      margin: 0;
    }
  `]
})
export class LoadingOverlay {
  readonly loading = inject(LoadingService);
}