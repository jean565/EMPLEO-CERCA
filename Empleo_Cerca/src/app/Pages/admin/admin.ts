import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Oferta } from '../../Models/oferta';
import { OfertaService } from '../../Services/oferta';
import { PostulacionService } from '../../Services/postulacion';
import Swal from 'sweetalert2';

@Component({ imports: [FormsModule, RouterLink], selector: 'app-admin', styleUrl: './admin.css', templateUrl: './admin.html' })
export class Admin {
  servicio = inject(OfertaService);
  postulaciones = inject(PostulacionService);
  router = inject(Router);
  detector = inject(ChangeDetectorRef);
  accesoDemo = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('empleo_demo_admin') === 'si';
  lista = this.servicio.mostrar();
  editando = false;
  formulario: Oferta = this.vacio();

  vacio(): Oferta {
    return { id: 0, titulo: '', empresa: '', ubicacion: 'Concepción', modalidad: 'Tiempo completo', sueldo: '', categoria: '', descripcion: '', requisitos: '' };
  }
  guardar() {
    if (!this.accesoDemo) return;
    const estabaEditando = this.editando;
    const datos = { ...this.formulario };
    if (this.editando) this.servicio.editar(datos);
    else this.servicio.agregar(datos);
    this.lista = this.servicio.mostrar();
    this.cancelar();
    Swal.fire({
      title: estabaEditando ? 'Oferta actualizada' : 'Oferta publicada',
      icon: 'success',
      confirmButtonColor: '#2563EB'
    });
  }
  seleccionar(oferta: Oferta) {
    this.formulario = { ...oferta };
    this.editando = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  eliminar(id: number) {
    if (!this.accesoDemo) return;
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
        this.lista = this.servicio.mostrar();
        this.detector.markForCheck();
        Swal.fire({
          title: 'Oferta eliminada',
          icon: 'success',
          confirmButtonColor: '#2563EB'
        });
      }
    });
  }
  cancelar() { this.formulario = this.vacio(); this.editando = false; }
  salir() { sessionStorage.removeItem('empleo_demo_admin'); this.router.navigate(['/login']); }
}
