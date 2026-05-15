import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { PreguntaBaseDto } from '../dto/preguntaBaseDTO';

@Injectable({ providedIn: 'root' })
export class PreguntaBaseService {
  private readonly api = `${environment.apiUrl}/preguntas-base`;

  constructor(private http: HttpClient) {}

  listarActivas(): Observable<PreguntaBaseDto[]> {
    return this.http.get<PreguntaBaseDto[]>(this.api);
  }

  guardar(data: PreguntaBaseDto): Observable<PreguntaBaseDto> {
    return this.http.post<PreguntaBaseDto>(this.api, data);
  }

  actualizar(id: number, data: PreguntaBaseDto): Observable<PreguntaBaseDto> {
    return this.http.put<PreguntaBaseDto>(`${this.api}/${id}`, data);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}