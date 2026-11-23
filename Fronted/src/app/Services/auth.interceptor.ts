import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SesionStore } from './sesion-store';

export const authInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const sesion = inject(SesionStore);
  const token = sesion.token();

  const peticionConToken = token
    ? peticion.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : peticion;

  return siguiente(peticionConToken).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        sesion.limpiar();
      }
      return throwError(() => error);
    })
  );
};
