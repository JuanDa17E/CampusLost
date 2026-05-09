import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PreguntaVerificacionDto } from '../dto/preguntaVerificacionDTO';
import { environment } from '../../enviroments/enviroment.prod';


@Injectable({ providedIn: 'root' })
export class PreguntaVerificacionService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/preguntas-verificacion`;

  guardar(data: PreguntaVerificacionDto): Observable<PreguntaVerificacionDto> {
    return this.http.post<PreguntaVerificacionDto>(this.api, data);
  }

  listarPorObjeto(idObjeto: number): Observable<PreguntaVerificacionDto[]> {
    return this.http.get<PreguntaVerificacionDto[]>(`${this.api}/objeto/${idObjeto}`);
  }

  actualizar(id: number, data: PreguntaVerificacionDto): Observable<PreguntaVerificacionDto> {
    return this.http.put<PreguntaVerificacionDto>(`${this.api}/${id}`, data);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}