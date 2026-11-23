import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Oferta } from '../Models/oferta';
import { API_URL } from './api';
import { OfertaService } from './oferta';

const OFERTA_EJEMPLO: Oferta = {
  id: 1,
  titulo: 'Asistente de prueba',
  empresa: 'Empresa de prueba',
  ubicacion: 'Concepción',
  modalidad: 'Tiempo completo',
  sueldo: 'S/ 1,200',
  categoria: 'Pruebas',
  descripcion: 'Descripción de la oferta de prueba.',
  requisitos: 'Requisitos de la oferta de prueba.'
};

describe('OfertaService', () => {
  let servicio: OfertaService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    servicio = TestBed.inject(OfertaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(servicio).toBeTruthy();
  });

  it('obtiene el listado público con GET', () => {
    let resultado: Oferta[] = [];
    servicio.mostrar().subscribe(datos => (resultado = datos));

    const peticion = http.expectOne(`${API_URL}/ofertas/`);
    expect(peticion.request.method).toBe('GET');
    peticion.flush([OFERTA_EJEMPLO]);

    expect(resultado.length).toBe(1);
  });

  it('crea una oferta con POST sin enviar el id', () => {
    const { id, ...datos } = OFERTA_EJEMPLO;
    servicio.agregar(datos).subscribe();

    const peticion = http.expectOne(`${API_URL}/ofertas/`);
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body.id).toBeUndefined();
    peticion.flush(OFERTA_EJEMPLO);
  });

  it('desactiva una oferta con DELETE', () => {
    servicio.eliminar(1).subscribe();
    const peticion = http.expectOne(`${API_URL}/ofertas/1`);
    expect(peticion.request.method).toBe('DELETE');
    peticion.flush({ mensaje: 'Oferta eliminada' });
  });
});
