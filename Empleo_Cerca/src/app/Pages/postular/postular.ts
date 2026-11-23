import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OfertaService } from '../../Services/oferta';
import { PostulacionService } from '../../Services/postulacion';
import Swal from 'sweetalert2';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-postular',
  styleUrl: './postular.css',
  templateUrl: './postular.html',
})
export class Postular {
  ruta = inject(ActivatedRoute);
  ofertas = inject(OfertaService);
  postulaciones = inject(PostulacionService);
  id = Number(this.ruta.snapshot.paramMap.get('id'));
  oferta = this.ofertas.obtenerPorId(this.id);
  nombre = '';
  correo = '';
  telefono = '';
  mensaje = '';
  enviado = false;

  get esAdmin(): boolean {
    return typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem('empleo_demo_admin') === 'si';
  }

  enviar() {
    if (this.esAdmin) return;
    if (!this.oferta || !this.nombre.trim() || !this.correo.trim() || !this.telefono.trim()) return;
    this.postulaciones.guardar({ id: 0, ofertaId: this.id, nombre: this.nombre, correo: this.correo, telefono: this.telefono, mensaje: this.mensaje });
    this.enviado = true;
    Swal.fire({
      title: 'Postulación registrada',
      text: 'Tu información se guardó correctamente.',
      icon: 'success',
      confirmButtonColor: '#2563EB'
    });
  }
}
