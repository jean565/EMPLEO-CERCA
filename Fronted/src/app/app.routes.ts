import { Routes } from '@angular/router';
import { DetalleOferta } from './Pages/detalle-oferta/detalle-oferta';
import { Inicio } from './Pages/inicio/inicio';
import { Login } from './Pages/login/login';
import { Nosotros } from './Pages/nosotros/nosotros';
import { Ofertas } from './Pages/ofertas/ofertas';
import { Postular } from './Pages/postular/postular';
import { Registro } from './Pages/registro/registro';
import { soloPostulante } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'ofertas', component: Ofertas },
  { path: 'nosotros', component: Nosotros },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'detalle-oferta/:id', component: DetalleOferta },
  { path: 'postular/:id', component: Postular, canActivate: [soloPostulante] },
  { path: 'admin', redirectTo: 'ofertas' },
  { path: '**', redirectTo: 'inicio' }
];
