import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from './api';
import { PostulacionService } from './postulacion';

describe('PostulacionService', () => {
  let servicio: PostulacionService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    servicio = TestBed.inject(PostulacionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(servicio).toBeTruthy();
  });

  it('envía una postulación con POST', () => {
    servicio.guardar({
      ofertaId: 5,
      nombre: 'Postulante de prueba',
      correo: 'postulante@test.com',
      telefono: '987654321',
      mensaje: 'Mensaje de prueba'
    }).subscribe();

    const peticion = http.expectOne(`${API_URL}/postulaciones/`);
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body.ofertaId).toBe(5);
    peticion.flush({
      id: 1,
      ofertaId: 5,
      usuarioId: 2,
      nombre: 'Postulante de prueba',
      correo: 'postulante@test.com',
      telefono: '987654321',
      mensaje: 'Mensaje de prueba',
      fecha: '2026-01-01T00:00:00+00:00'
    });
  });
});
