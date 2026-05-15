export interface RespuestaReclamacionDto {
  idRespuesta?: number;
  intento?: { idIntento?: number };
  preguntaBase?: { idPreguntaBase?: number };
  respuestaDada?: string;
}