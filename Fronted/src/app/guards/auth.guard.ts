import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { Rol } from '../Models/usuario';
import { UsuarioService } from '../Services/usuario';

function crearGuard(rol: Rol): CanActivateFn {
  return (_ruta, estado) => {
    const usuarios = inject(UsuarioService);
    const router = inject(Router);

    const irALogin = () =>
      router.createUrlTree(['/login'], { queryParams: { returnUrl: estado.url } });

    if (!usuarios.hayToken()) {
      return irALogin();
    }

    return usuarios.obtenerUsuarioActual().pipe(
      map(usuario => (usuario.rol === rol ? true : router.createUrlTree(['/ofertas']))),
      catchError(() => of(irALogin()))
    );
  };
}

export const soloPostulante = crearGuard('postulante');
export const soloAdmin = crearGuard('administrador');
