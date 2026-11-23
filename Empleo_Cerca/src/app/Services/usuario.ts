import { Injectable } from '@angular/core';
import { Usuario } from '../Models/usuario';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  usuario: Usuario | null = null;

  registrar(usuario: Usuario) {
    this.usuario = usuario;
  }

  iniciarDemo(correo: string, clave: string): boolean {
    return correo === 'admin@demo.local' && clave === 'demo123';
  }
}
