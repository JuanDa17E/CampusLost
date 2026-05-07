import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService, Notificacion } from '../services/notificacion.service';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.css',
})
export class NotificacionesComponent {
  readonly notificacionService = inject(NotificacionService);

  getIcono(tipo: Notificacion['tipo']): string {
    switch (tipo) {
      case 'exito': return 'ti-circle-check';
      case 'error': return 'ti-circle-x';
      case 'advertencia': return 'ti-alert-triangle';
      default: return 'ti-info-circle';
    }
  }
}