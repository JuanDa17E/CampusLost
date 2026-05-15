export interface IntentoReclamacionDto {
  idIntento?: number;
  objeto?: { idObjeto?: number };
  usuario?: { idUsuario?: number };
  fecha?: string;
  estado?: 'pendiente' | 'aprobado' | 'rechazado';
}