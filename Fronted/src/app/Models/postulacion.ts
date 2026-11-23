export interface Postulacion {
  id: number;
  ofertaId: number;
  usuarioId: number;
  nombre: string;
  correo: string;
  telefono: string;
  mensaje: string;
  fecha: string;
}

export type PostulacionCrear = Omit<Postulacion, 'id' | 'usuarioId' | 'fecha'>;
