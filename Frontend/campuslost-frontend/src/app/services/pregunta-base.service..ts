import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PreguntaBase } from '../dto/pregunta.base.dto';

@Injectable({ providedIn: 'root' })
export class PreguntaBaseService {
  private readonly api = 'http://localhost:8080/api/preguntas-base';

  constructor(private http: HttpClient) {}

  listar(): Observable<PreguntaBase[]> {
    return this.http.get<PreguntaBase[]>(this.api);
  }

  crear(data: Partial<PreguntaBase>): Observable<PreguntaBase> {
    return this.http.post<PreguntaBase>(this.api, data);
  }

  actualizar(id: number, data: Partial<PreguntaBase>): Observable<PreguntaBase> {
    return this.http.put<PreguntaBase>(`${this.api}/${id}`, data);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}