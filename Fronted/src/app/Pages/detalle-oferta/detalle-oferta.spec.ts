import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Oferta } from '../../Models/oferta';
import { DetalleOferta } from './detalle-oferta';

const OFERTA: Oferta = {
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

describe('DetalleOferta', () => {
  let component: DetalleOferta;
  let fixture: ComponentFixture<DetalleOferta>;

  beforeEach(async () => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
    await TestBed.configureTestingModule({
      imports: [DetalleOferta],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleOferta);
    component = fixture.componentInstance;
    TestBed.inject(HttpTestingController).match(() => true).forEach(peticion => peticion.flush(OFERTA));
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
