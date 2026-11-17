
import { Routes } from '@angular/router';

import { Inicio } from './Pages/inicio/inicio';
import { Nosotros } from './Pages/nosotros/nosotros';
import { Login } from './Pages/login/login';
import { Registro } from './Pages/registro/registro';
import { DetalleOferta } from './Pages/detalle-oferta/detalle-oferta';
import { Postular } from './Pages/postular/postular';
import { Admin } from './Pages/admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'nosotros', component: Nosotros },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'detalle-oferta', component: DetalleOferta },
  { path: 'postular', component: Postular },
  { path: 'admin', component: Admin },
  { path: '**', redirectTo: 'inicio' }
];
