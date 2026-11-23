export type Rol = 'administrador' | 'postulante';

export interface Usuario {
  id: number;
  nombre: string;
  contacto: string;
  nombre_usuario: string;
  rol: Rol;
}

export interface Sesion {
  token: string;
  tipo: string;
  usuario: Usuario;
}

export interface RegistroPayload {
  nombre: string;
  contacto: string;
  nombre_usuario: string;
  contrasena: string;
}
