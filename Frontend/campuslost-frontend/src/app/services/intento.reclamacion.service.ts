import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IntentoReclamacionDto } from '../dto/intentoReclamacionDTO';
import { environment } from '../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class IntentoReclamacionService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/intentos-reclamacion`;

  crear(data: IntentoReclamacionDto): Observable<IntentoReclamacionDto> {
    return this.http.post<IntentoReclamacionDto>(this.api, data);
  }

  listarPorObjeto(idObjeto: number): Observable<IntentoReclamacionDto[]> {
    return this.http.get<IntentoReclamacionDto[]>(`${this.api}/objeto/${idObjeto}`);
  }

  listarPorUsuario(idUsuario: number): Observable<IntentoReclamacionDto[]> {
    return this.http.get<IntentoReclamacionDto[]>(`${this.api}/usuario/${idUsuario}`);
  }

  cambiarEstado(id: number, estado: string): Observable<IntentoReclamacionDto> {
    return this.http.patch<IntentoReclamacionDto>(`${this.api}/${id}/estado?estado=${estado}`, {});
  }
}