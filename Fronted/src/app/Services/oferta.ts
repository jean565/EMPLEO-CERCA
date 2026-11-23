import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Oferta, OfertaCrear } from '../Models/oferta';
import { API_URL } from './api';

@Injectable({ providedIn: 'root' })
export class OfertaService {
  private readonly http = inject(HttpClient);

  mostrar(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${API_URL}/ofertas/`);
  }

  obtenerPorId(id: number): Observable<Oferta> {
    return this.http.get<Oferta>(`${API_URL}/ofertas/${id}`);
  }

  agregar(oferta: OfertaCrear): Observable<Oferta> {
    return this.http.post<Oferta>(`${API_URL}/ofertas/`, oferta);
  }

  editar(oferta: Oferta): Observable<Oferta> {
    return this.http.put<Oferta>(`${API_URL}/ofertas/${oferta.id}`, this.sinId(oferta));
  }

  eliminar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${API_URL}/ofertas/${id}`);
  }

  private sinId(oferta: Oferta): OfertaCrear {
    const { id, ...datos } = oferta;
    return datos;
  }
}
