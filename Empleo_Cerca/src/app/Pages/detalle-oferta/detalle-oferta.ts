import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OfertaService } from '../../Services/oferta';

@Component({
  imports: [RouterLink],
  selector: 'app-detalle-oferta',
  styleUrl: './detalle-oferta.css',
  templateUrl: './detalle-oferta.html',
})
export class DetalleOferta {
  servicio = inject(OfertaService);
  ruta = inject(ActivatedRoute);
  id = Number(this.ruta.snapshot.paramMap.get('id'));
  oferta = this.servicio.obtenerPorId(this.id);

  get esAdmin(): boolean {
    return typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem('empleo_demo_admin') === 'si';
  }
}
