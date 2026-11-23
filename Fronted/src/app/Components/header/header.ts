import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../Services/usuario';

@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  private readonly router = inject(Router);
  readonly usuarios = inject(UsuarioService);

  get autenticado(): boolean {
    return this.usuarios.autenticado();
  }

  get esAdmin(): boolean {
    return this.usuarios.esAdmin();
  }

  get nombreUsuario(): string {
    return this.usuarios.usuario()?.nombre || 'Usuario';
  }

  salir() {
    this.usuarios.cerrarSesion().subscribe({
      next: () => this.router.navigate(['/inicio']),
      error: () => this.router.navigate(['/inicio'])
    });
  }
}
