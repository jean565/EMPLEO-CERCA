import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Oferta } from '../../Models/oferta';
import { OfertaService } from '../../Services/oferta';
import { PostulacionService } from '../../Services/postulacion';
import { UsuarioService } from '../../Services/usuario';
import Swal from 'sweetalert2';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-postular',
  styleUrl: './postular.css',
  templateUrl: './postular.html',
})
export class Postular {
  private readonly ruta = inject(ActivatedRoute);
  private readonly ofertasServicio = inject(OfertaService);
  private readonly postulacionesServicio = inject(PostulacionService);
  private readonly usuarios = inject(UsuarioService);

  readonly id = Number(this.ruta.snapshot.paramMap.get('id'));
  readonly oferta = signal<Oferta | null>(null);
  readonly cargando = signal(true);
  readonly error = signal('');

  nombre = '';
  correo = '';
  telefono = '';
  mensaje = '';
  enviado = false;
  enviando = false;

  constructor() {
    this.ofertasServicio.obtenerPorId(this.id).subscribe({
      next: oferta => {
        this.oferta.set(oferta);
        this.cargando.set(false);
        this.prellenarDatos();
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

  enviar() {
    if (this.esAdmin || this.enviando) {
      return;
    }
    if (!this.oferta() || !this.nombre.trim() || !this.correo.trim() || !this.telefono.trim()) {
      return;
    }

    this.enviando = true;
    this.postulacionesServicio.guardar({
      ofertaId: this.id,
      nombre: this.nombre.trim(),
      correo: this.correo.trim().toLowerCase(),
      telefono: this.telefono.trim(),
      mensaje: this.mensaje.trim()
    }).subscribe({
      next: () => {
        this.enviando = false;
        this.enviado = true;
        Swal.fire({
          title: 'Postulación registrada',
          text: 'Tu información se guardó correctamente.',
          icon: 'success',
          confirmButtonColor: '#2563EB'
        });
      },
      error: (error: HttpErrorResponse) => {
        this.enviando = false;
        Swal.fire({
          title: 'No se pudo postular',
          text: this.mensajeError(error),
          icon: 'error',
          confirmButtonColor: '#2563EB'
        });
      }
    });
  }

  private prellenarDatos() {
    const usuario = this.usuarios.usuario();
    if (!usuario) {
      return;
    }
    this.nombre = usuario.nombre;
    if (usuario.contacto.includes('@')) {
      this.correo = usuario.contacto;
    } else {
      this.telefono = usuario.contacto;
    }
  }

  private mensajeError(error: HttpErrorResponse): string {
    const detalle = error.error?.detail;
    if (typeof detalle === 'string') {
      return detalle;
    }
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
    }
    if (error.status === 404) {
      return 'Oferta no encontrada.';
    }
    return 'Revisa los datos e intenta nuevamente.';
  }
}
