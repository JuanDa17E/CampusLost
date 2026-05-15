import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _activo = signal(false);
  readonly activo = this._activo.asReadonly();

  mostrar(): void  { this._activo.set(true);  }
  ocultar(): void  { this._activo.set(false); }
}