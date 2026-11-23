import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../Models/usuario';

const CLAVE_TOKEN = 'empleo_token';

@Injectable({ providedIn: 'root' })
export class SesionStore {
  private readonly _token = signal<string | null>(this.leerToken());
  private readonly _usuario = signal<Usuario | null>(null);

  readonly token = this._token.asReadonly();
  readonly usuario = this._usuario.asReadonly();
  readonly autenticado = computed(() => this._token() !== null);
  readonly esAdmin = computed(() => this._usuario()?.rol === 'administrador');
  readonly esPostulante = computed(() => this._usuario()?.rol === 'postulante');

  guardar(token: string, usuario: Usuario): void {
    this._token.set(token);
    this._usuario.set(usuario);
    this.guardarToken(token);
  }

  actualizarUsuario(usuario: Usuario): void {
    this._usuario.set(usuario);
  }

  limpiar(): void {
    this._token.set(null);
    this._usuario.set(null);
    this.borrarToken();
  }

  private leerToken(): string | null {
    try {
      return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(CLAVE_TOKEN) : null;
    } catch {
      return null;
    }
  }

  private guardarToken(token: string): void {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(CLAVE_TOKEN, token);
      }
    } catch {
      // Si el navegador bloquea el almacenamiento, la sesión sigue en memoria.
    }
  }

  private borrarToken(): void {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(CLAVE_TOKEN);
      }
    } catch {
      // No hay nada que limpiar si el almacenamiento no está disponible.
    }
  }
}
