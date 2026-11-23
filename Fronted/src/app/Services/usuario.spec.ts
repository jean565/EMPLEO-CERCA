import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from './api';
import { SesionStore } from './sesion-store';
import { UsuarioService } from './usuario';

describe('UsuarioService', () => {
  let servicio: UsuarioService;
  let http: HttpTestingController;

  beforeEach(() => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    TestBed.inject(SesionStore).limpiar();
    servicio = TestBed.inject(UsuarioService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.inject(SesionStore).limpiar();
    http.verify();
  });

  it('should be created', () => {
    expect(servicio).toBeTruthy();
  });

  it('inicia sesión y guarda el token', () => {
    servicio.iniciarSesion('postulante@test.com', 'clave-segura').subscribe();

    const peticion = http.expectOne(`${API_URL}/usuarios/login`);
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body.contacto).toBe('postulante@test.com');
    peticion.flush({
      token: 'token-de-prueba',
      tipo: 'bearer',
      usuario: {
        id: 1,
        nombre: 'Postulante de prueba',
        contacto: 'postulante@test.com',
        nombre_usuario: 'postulante_prueba',
        rol: 'postulante'
      }
    });

    expect(servicio.hayToken()).toBe(true);
    expect(servicio.esPostulante()).toBe(true);
    expect(servicio.esAdmin()).toBe(false);
  });

  it('limpia la sesión al cerrar sesión', () => {
    servicio.iniciarSesion('postulante@test.com', 'clave-segura').subscribe();
    http.expectOne(`${API_URL}/usuarios/login`).flush({
      token: 'token-de-prueba',
      tipo: 'bearer',
      usuario: {
        id: 1,
        nombre: 'Postulante de prueba',
        contacto: 'postulante@test.com',
        nombre_usuario: 'postulante_prueba',
        rol: 'postulante'
      }
    });

    servicio.cerrarSesion().subscribe();
    http.expectOne(`${API_URL}/usuarios/logout`).flush({ mensaje: 'Sesión cerrada' });

    expect(servicio.hayToken()).toBe(false);
  });
});
