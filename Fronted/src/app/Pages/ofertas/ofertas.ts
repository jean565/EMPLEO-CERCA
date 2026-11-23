import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Oferta, OfertaCrear } from '../../Models/oferta';
import { Postulacion } from '../../Models/postulacion';
import { OfertaService } from '../../Services/oferta';
import { PostulacionService } from '../../Services/postulacion';
import { UsuarioService } from '../../Services/usuario';
import Swal from 'sweetalert2';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-ofertas',
  styleUrl: './ofertas.css',
  templateUrl: './ofertas.html',
})
export class Ofertas {
  private readonly servicio = inject(OfertaService);
  private readonly servicioPostulaciones = inject(PostulacionService);
  private readonly usuarios = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);

  textoBuscar = this.ruta.snapshot.queryParamMap.get('buscar') || '';
  categoriaBuscar = this.ruta.snapshot.queryParamMap.get('categoria') || '';
  cantidadMostrar = 6;
  formularioAbierto = false;
  editando = false;
  verPostulaciones = false;
  formulario: Oferta = this.vacio();

  readonly ofertas = signal<Oferta[]>([]);
  readonly postulaciones = signal<Postulacion[]>([]);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal('');

  constructor() {
    this.cargarOfertas();
  }

  get esAdmin(): boolean {
    return this.usuarios.esAdmin();
  }

  get categorias(): string[] {
    return [...new Set(this.ofertas().map(oferta => oferta.categoria))];
  }

  get listaOfertas(): Oferta[] {
    const texto = this.textoBuscar.toLowerCase().trim();
    return this.ofertas().filter(oferta => {
      const coincideTexto = oferta.titulo.toLowerCase().includes(texto) ||
        oferta.empresa.toLowerCase().includes(texto);
      const coincideCategoria = !this.categoriaBuscar || oferta.categoria === this.categoriaBuscar;
      return coincideTexto && coincideCategoria;
    });
  }

  cargarOfertas() {
    this.cargando.set(true);
    this.error.set('');
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

  buscarOfertas() {
    this.cantidadMostrar = 6;
  }

  mostrarMas() {
    this.cantidadMostrar = this.listaOfertas.length;
  }

  mostrarMenos() {
    this.cantidadMostrar = 6;
  }

  nuevaOferta() {
    if (!this.esAdmin) return;
    this.formulario = this.vacio();
    this.editando = false;
    this.formularioAbierto = true;
  }

  editarOferta(oferta: Oferta) {
    if (!this.esAdmin) return;
    this.formulario = { ...oferta };
    this.editando = true;
    this.formularioAbierto = true;
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  guardarOferta() {
    if (!this.esAdmin || this.guardando()) return;
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
        this.textoBuscar = '';
        this.categoriaBuscar = '';
        this.cargarOfertas();
        Swal.fire({
          title: estabaEditando ? 'Oferta actualizada' : 'Oferta publicada',
          text: estabaEditando ? 'Los cambios se guardaron correctamente.' : 'La oferta se agregó correctamente.',
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

  eliminarOferta(id: number) {
    if (!this.esAdmin) return;
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
          this.cargarOfertas();
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

  alternarPostulaciones() {
    this.verPostulaciones = !this.verPostulaciones;
    if (this.verPostulaciones) {
      this.cargarPostulaciones();
    }
  }

  cargarPostulaciones() {
    this.servicioPostulaciones.mostrar().subscribe({
      next: postulaciones => this.postulaciones.set(postulaciones),
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          title: 'No se pudieron cargar las postulaciones',
          text: this.mensajeError(error),
          icon: 'error',
          confirmButtonColor: '#2563EB'
        });
      }
    });
  }

  cancelar() {
    this.formulario = this.vacio();
    this.editando = false;
    this.formularioAbierto = false;
  }

  salir() {
    this.usuarios.cerrarSesion().subscribe({
      next: () => this.router.navigate(['/inicio']),
      error: () => this.router.navigate(['/inicio'])
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
