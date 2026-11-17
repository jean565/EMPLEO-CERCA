import { TestBed } from '@angular/core/testing';
import { Postulacion } from './postulacion';

describe('Postulacion', () => {
  let service: Postulacion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Postulacion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
