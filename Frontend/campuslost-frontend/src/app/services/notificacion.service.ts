import { Injectable, signal } from '@angular/core';

export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: 'error' | 'exito' | 'advertencia' | 'info';
}

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private contador = 0;
  notificaciones = signal<Notificacion[]>([]);

  mostrar(mensaje: string, tipo: Notificacion['tipo'] = 'info', duracion = 4000): void {
    const id = ++this.contador;
    this.notificaciones.update(n => [...n, { id, mensaje, tipo }]);
    setTimeout(() => this.cerrar(id), duracion);
  }

  exito(mensaje: string): void { this.mostrar(mensaje, 'exito'); }
  error(mensaje: string): void { this.mostrar(mensaje, 'error'); }
  advertencia(mensaje: string): void { this.mostrar(mensaje, 'advertencia'); }
  info(mensaje: string): void { this.mostrar(mensaje, 'info'); }

  cerrar(id: number): void {
    this.notificaciones.update(n => n.filter(x => x.id !== id));
  }

  parsearError(error: any): string {
    if (error?.error?.mensaje) return error.error.mensaje;
    if (error?.message) return error.message;
    return 'Ocurrió un error inesperado.';
  }
}