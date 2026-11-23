import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Oferta } from '../../Models/oferta';
import { OfertaService } from '../../Services/oferta';
import { PostulacionService } from '../../Services/postulacion';
import Swal from 'sweetalert2';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-ofertas',
  styleUrl: './ofertas.css',
  templateUrl: './ofertas.html',
})
export class Ofertas {
  servicio = inject(OfertaService);
  postulaciones = inject(PostulacionService);
  router = inject(Router);
  ruta = inject(ActivatedRoute);
  detector = inject(ChangeDetectorRef);

  textoBuscar = this.ruta.snapshot.queryParamMap.get('buscar') || '';
  categoriaBuscar = this.ruta.snapshot.queryParamMap.get('categoria') || '';
  listaOfertas: Oferta[] = [];
  cantidadMostrar = 6;
  formularioAbierto = false;
  editando = false;
  verPostulaciones = false;
  formulario: Oferta = this.vacio();

  constructor() {
    this.buscarOfertas();
  }

  get esAdmin(): boolean {
    return typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem('empleo_demo_admin') === 'si';
  }

  vacio(): Oferta {
    return {
      id: 0, titulo: '', empresa: '', ubicacion: 'Concepción',
      modalidad: 'Tiempo completo', sueldo: '', categoria: '',
      descripcion: '', requisitos: ''
    };
  }

  buscarOfertas() {
    const texto = this.textoBuscar.toLowerCase().trim();
    this.listaOfertas = this.servicio.mostrar().filter(oferta => {
      const coincideTexto = oferta.titulo.toLowerCase().includes(texto) ||
        oferta.empresa.toLowerCase().includes(texto);
      const coincideCategoria = !this.categoriaBuscar || oferta.categoria === this.categoriaBuscar;
      return coincideTexto && coincideCategoria;
    });
    this.cantidadMostrar = 6;
  }

  get categorias(): string[] {
    return [...new Set(this.servicio.mostrar().map(oferta => oferta.categoria))];
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
    if (!this.esAdmin) return;
    const estabaEditando = this.editando;
    const datos = { ...this.formulario };
    if (this.editando) this.servicio.editar(datos);
    else this.servicio.agregar(datos);
    this.cancelar();
    this.textoBuscar = '';
    this.categoriaBuscar = '';
    this.buscarOfertas();
    Swal.fire({
      title: estabaEditando ? 'Oferta actualizada' : 'Oferta publicada',
      text: estabaEditando ? 'Los cambios se guardaron correctamente.' : 'La oferta se agregó correctamente.',
      icon: 'success',
      confirmButtonColor: '#2563EB'
    });
  }

  eliminarOferta(id: number) {
    if (!this.esAdmin) return;
    Swal.fire({
      title: '¿Eliminar esta oferta?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#64748B'
    }).then((respuesta) => {
      if (respuesta.isConfirmed) {
        this.servicio.eliminar(id);
        this.buscarOfertas();
        this.detector.markForCheck();
        Swal.fire({
          title: 'Oferta eliminada',
          icon: 'success',
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
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('empleo_demo_admin');
    this.cancelar();
    this.router.navigate(['/inicio']);
  }
}
