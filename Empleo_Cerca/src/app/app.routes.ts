import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { Inicio } from './Pages/inicio/inicio';
import { Ofertas } from './Pages/ofertas/ofertas';
import { Nosotros } from './Pages/nosotros/nosotros';
import { Login } from './Pages/login/login';
import { Registro } from './Pages/registro/registro';
import { DetalleOferta } from './Pages/detalle-oferta/detalle-oferta';
import { Postular } from './Pages/postular/postular';

const soloPostulantes: CanActivateFn = () => {
  const esAdmin = typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem('empleo_demo_admin') === 'si';
  if (esAdmin) {
    return inject(Router).createUrlTree(['/ofertas']);
  }
  return true;
};

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'ofertas', component: Ofertas },
  { path: 'nosotros', component: Nosotros },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'detalle-oferta/:id', component: DetalleOferta },
  { path: 'postular/:id', component: Postular, canActivate: [soloPostulantes] },
  { path: 'admin', redirectTo: 'ofertas' },
  { path: '**', redirectTo: 'inicio' }
];
