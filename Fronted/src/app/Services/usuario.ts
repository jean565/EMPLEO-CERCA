import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, finalize, of, tap } from 'rxjs';
import { RegistroPayload, Sesion, Usuario } from '../Models/usuario';
import { API_URL } from './api';
import { SesionStore } from './sesion-store';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly sesion = inject(SesionStore);

  readonly token = this.sesion.token;
  readonly usuario = this.sesion.usuario;
  readonly autenticado = this.sesion.autenticado;
  readonly esAdmin = this.sesion.esAdmin;
  readonly esPostulante = this.sesion.esPostulante;

  registrar(datos: RegistroPayload): Observable<Usuario> {
    return this.http.post<Usuario>(`${API_URL}/usuarios/registro`, datos);
  }

  iniciarSesion(contacto: string, contrasena: string): Observable<Sesion> {
    return this.http
      .post<Sesion>(`${API_URL}/usuarios/login`, { contacto, contrasena })
      .pipe(tap(sesion => this.sesion.guardar(sesion.token, sesion.usuario)));
  }

  cerrarSesion(): Observable<{ mensaje: string }> {
    if (!this.hayToken()) {
      this.sesion.limpiar();
      return of({ mensaje: 'Sesión cerrada' });
    }

    return this.http
      .post<{ mensaje: string }>(`${API_URL}/usuarios/logout`, {})
      .pipe(finalize(() => this.sesion.limpiar()));
  }

  obtenerUsuarioActual(): Observable<Usuario> {
    const usuarioActual = this.sesion.usuario();
    if (usuarioActual) {
      return of(usuarioActual);
    }

    return this.http
      .get<Usuario>(`${API_URL}/usuarios/yo`)
      .pipe(tap(usuario => this.sesion.actualizarUsuario(usuario)));
  }

  restaurarSesion(): void {
    if (!this.hayToken() || this.sesion.usuario()) {
      return;
    }
    this.obtenerUsuarioActual().subscribe({
      error: () => this.sesion.limpiar()
    });
  }

  hayToken(): boolean {
    return this.sesion.token() !== null;
  }

  limpiarSesion(): void {
    this.sesion.limpiar();
  }
}
