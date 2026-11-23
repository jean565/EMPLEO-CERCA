import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Oferta } from '../../Models/oferta';
import { OfertaService } from '../../Services/oferta';
import { UsuarioService } from '../../Services/usuario';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  private readonly servicio = inject(OfertaService);
  private readonly usuarios = inject(UsuarioService);
  private readonly router = inject(Router);

  textoBuscar = '';
  categoriaBuscar = '';

  readonly ofertas = signal<Oferta[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');

  constructor() {
    this.servicio.mostrar().subscribe({
      next: ofertas => {
        this.ofertas.set(ofertas);
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.mensajeError(error));
        this.cargando.set(false);
      }
    });
  }

  get esAdmin(): boolean {
    return this.usuarios.esAdmin();
  }

  get recientes(): Oferta[] {
    return this.ofertas().slice(-3).reverse();
  }

  get categorias(): string[] {
    return [...new Set(this.ofertas().map(oferta => oferta.categoria))];
  }

  buscar() {
    this.router.navigate(['/ofertas'], {
      queryParams: { buscar: this.textoBuscar, categoria: this.categoriaBuscar }
    });
  }

  private mensajeError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
    }
    return 'No se pudieron cargar las ofertas.';
  }
}
