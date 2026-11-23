import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Oferta, OfertaCrear } from '../../Models/oferta';
import { Postulacion } from '../../Models/postulacion';
import { OfertaService } from '../../Services/oferta';
import { PostulacionService } from '../../Services/postulacion';
import { UsuarioService } from '../../Services/usuario';
import Swal from 'sweetalert2';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-admin',
  styleUrl: './admin.css',
  templateUrl: './admin.html',
})
export class Admin {
  private readonly servicio = inject(OfertaService);
  private readonly servicioPostulaciones = inject(PostulacionService);
  private readonly usuarios = inject(UsuarioService);
  private readonly router = inject(Router);

  readonly lista = signal<Oferta[]>([]);
  readonly postulaciones = signal<Postulacion[]>([]);
  readonly guardando = signal(false);
  editando = false;
  formulario: Oferta = this.vacio();

  constructor() {
    if (this.accesoDemo) {
      this.cargar();
      this.cargarPostulaciones();
    }
  }

  get accesoDemo(): boolean {
    return this.usuarios.esAdmin();
  }

  cargar() {
    this.servicio.mostrar().subscribe({
      next: lista => this.lista.set(lista)
    });
  }

  cargarPostulaciones() {
    this.servicioPostulaciones.mostrar().subscribe({
      next: postulaciones => this.postulaciones.set(postulaciones)
    });
  }

  guardar() {
    if (!this.accesoDemo || this.guardando()) return;
    const estabaEditando = this.editando;
    const datos = { ...this.formulario };
    const peticion = estabaEditando
      ? this.servicio.editar(datos)
      : this.servicio.agregar(this.sinId(datos));

    this.guardando.set(true);
    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cancelar();
        this.cargar();
        Swal.fire({
          title: estabaEditando ? 'Oferta actualizada' : 'Oferta publicada',
          icon: 'success',
          confirmButtonColor: '#2563EB'
        });
      },
      error: (error: HttpErrorResponse) => {
        this.guardando.set(false);
        Swal.fire({
          title: 'No se pudo guardar la oferta',
          text: this.mensajeError(error),
          icon: 'error',
          confirmButtonColor: '#2563EB'
        });
      }
    });
  }

  seleccionar(oferta: Oferta) {
    this.formulario = { ...oferta };
    this.editando = true;
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: number) {
    if (!this.accesoDemo) return;
    Swal.fire({
      title: '¿Eliminar esta oferta?',
      text: 'La oferta dejará de mostrarse a los visitantes.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#64748B'
    }).then((respuesta) => {
      if (!respuesta.isConfirmed) return;
      this.servicio.eliminar(id).subscribe({
        next: () => {
          this.cargar();
          Swal.fire({
            title: 'Oferta eliminada',
            icon: 'success',
            confirmButtonColor: '#2563EB'
          });
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'No se pudo eliminar la oferta',
            text: this.mensajeError(error),
            icon: 'error',
            confirmButtonColor: '#2563EB'
          });
        }
      });
    });
  }

  cancelar() {
    this.formulario = this.vacio();
    this.editando = false;
  }

  salir() {
    this.usuarios.cerrarSesion().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }

  private vacio(): Oferta {
    return {
      id: 0, titulo: '', empresa: '', ubicacion: 'Concepción',
      modalidad: 'Tiempo completo', sueldo: '', categoria: '',
      descripcion: '', requisitos: ''
    };
  }

  private sinId(oferta: Oferta): OfertaCrear {
    const { id, ...datos } = oferta;
    return datos;
  }

  private mensajeError(error: HttpErrorResponse): string {
    const detalle = error.error?.detail;
    if (Array.isArray(detalle)) {
      return detalle.map((item: { msg?: string }) => item.msg || '').filter(Boolean).join(' ');
    }
    if (typeof detalle === 'string') {
      return detalle;
    }
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
    }
    return 'Ocurrió un error inesperado.';
  }
}
