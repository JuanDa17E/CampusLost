import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment.prod';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private api = `${environment.apiUrl}/auth`;

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(data: { correo: string; contrasena: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/login`, data);
  }

  registrar(data: { nombre: string; correo: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.api}/registro`, data, { responseType: 'text' });
  }

  guardarSesion(usuario: any): void {
    if (!this.isBrowser) return;
    const sesionMinima = {
      idUsuario: usuario.idUsuario ?? usuario.id_usuario,
      nombre: usuario.nombre,
      rol: usuario.rol?.nombre ?? usuario.rol
    };
    sessionStorage.setItem('usuario', JSON.stringify(sesionMinima));
  }

  obtenerSesion(): any {
    if (!this.isBrowser) return null;
    const raw = sessionStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  }

  cerrarSesion(): void {
    if (!this.isBrowser) return;
    sessionStorage.removeItem('usuario');
  }

  estaLogueado(): boolean {
    if (!this.isBrowser) return false;
    return !!sessionStorage.getItem('usuario');
  }

}