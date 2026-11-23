import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OfertaService } from '../../Services/oferta';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  servicio = inject(OfertaService);
  router = inject(Router);
  textoBuscar = '';
  categoriaBuscar = '';

  get esAdmin(): boolean {
    return typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem('empleo_demo_admin') === 'si';
  }

  get recientes() {
    return this.servicio.mostrar().slice(-3).reverse();
  }

  get categorias() {
    return [...new Set(this.servicio.mostrar().map(oferta => oferta.categoria))];
  }

  buscar() {
    this.router.navigate(['/ofertas'], {
      queryParams: { buscar: this.textoBuscar, categoria: this.categoriaBuscar }
    });
  }
}
