import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaReclamacionDto } from '../dto/respuestaReclamacionDTO';
import { environment } from '../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class RespuestaReclamacionService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/respuestas-reclamacion`;

  guardar(data: RespuestaReclamacionDto): Observable<RespuestaReclamacionDto> {
    return this.http.post<RespuestaReclamacionDto>(this.api, data);
  }

  listarPorIntento(idIntento: number): Observable<RespuestaReclamacionDto[]> {
    return this.http.get<RespuestaReclamacionDto[]>(`${this.api}/intento/${idIntento}`);
  }
}