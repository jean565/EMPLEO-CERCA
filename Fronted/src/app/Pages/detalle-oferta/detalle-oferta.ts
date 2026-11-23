import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Oferta } from '../../Models/oferta';
import { OfertaService } from '../../Services/oferta';
import { UsuarioService } from '../../Services/usuario';

@Component({
  imports: [RouterLink],
  selector: 'app-detalle-oferta',
  styleUrl: './detalle-oferta.css',
  templateUrl: './detalle-oferta.html',
})
export class DetalleOferta {
  private readonly servicio = inject(OfertaService);
  private readonly usuarios = inject(UsuarioService);
  private readonly ruta = inject(ActivatedRoute);

  readonly id = Number(this.ruta.snapshot.paramMap.get('id'));
  readonly oferta = signal<Oferta | null>(null);
  readonly cargando = signal(true);
  readonly error = signal('');

  constructor() {
    this.servicio.obtenerPorId(this.id).subscribe({
      next: oferta => {
        this.oferta.set(oferta);
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(error.status === 404 ? 'Oferta no encontrada' : this.mensajeError(error));
        this.cargando.set(false);
      }
    });
  }

  get esAdmin(): boolean {
    return this.usuarios.esAdmin();
  }

  private mensajeError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor';
    }
    return 'No se pudo cargar la oferta';
  }
}
