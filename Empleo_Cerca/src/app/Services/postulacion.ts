import { Injectable } from '@angular/core';
import { Postulacion } from '../Models/postulacion';

@Injectable({ providedIn: 'root' })
export class PostulacionService {
  postulaciones: Postulacion[] = this.cargar();

  cargar(): Postulacion[] {
    try {
      return JSON.parse(localStorage.getItem('empleo_postulaciones') || '[]') as Postulacion[];
    } catch {
      return [];
    }
  }

  guardar(postulacion: Postulacion) {
    postulacion.id = Date.now();
    this.postulaciones.push(postulacion);
    localStorage.setItem('empleo_postulaciones', JSON.stringify(this.postulaciones));
  }

  mostrar() {
    return this.postulaciones;
  }
}
