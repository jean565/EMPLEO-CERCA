import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Postulacion, PostulacionCrear } from '../Models/postulacion';
import { API_URL } from './api';

@Injectable({ providedIn: 'root' })
export class PostulacionService {
  private readonly http = inject(HttpClient);

  guardar(postulacion: PostulacionCrear): Observable<Postulacion> {
    return this.http.post<Postulacion>(`${API_URL}/postulaciones/`, postulacion);
  }

  mostrar(): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${API_URL}/postulaciones/`);
  }

  mias(): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${API_URL}/postulaciones/mias`);
  }
}
