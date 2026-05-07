export interface PreguntaVerificacionDto {
  idPregunta?: number;
  objeto?: { idObjeto?: number };
  usuario?: { idUsuario?: number };
  preguntaBase?: { idPreguntaBase?: number };
  respuesta?: string;
}