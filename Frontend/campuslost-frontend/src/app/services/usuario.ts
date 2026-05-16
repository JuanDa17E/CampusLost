import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

export interface UsuarioDto {
  idUsuario?: number;
  nombre: string;
  correo: string;
  contrasena?: string;
  fechaCreacion?: string;

  // Rol (requerido por backend/BD)
  idRol?: number;
  rol?: {
    idRol?: number;
    id_rol?: number;
    nombre?: string;
  };

  // Backends a veces envían snake_case
  id_usuario?: number;
  fecha_creacion?: string;
  id_rol?: number;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  crear(usuario: UsuarioDto): Observable<UsuarioDto> {
    return this.http.post<UsuarioDto>(this.baseUrl, usuario);
  }

  listar(): Observable<UsuarioDto[]> {
    return this.http.get<UsuarioDto[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<UsuarioDto> {
    return this.http.get<UsuarioDto>(`${this.baseUrl}/${id}`);
  }

  actualizar(id: number, usuario: UsuarioDto, editorId: number): Observable<UsuarioDto> {
    return this.http.put<UsuarioDto>(`${this.baseUrl}/${id}?editorId=${editorId}`,
      usuario
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
