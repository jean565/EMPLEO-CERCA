import { TestBed } from '@angular/core/testing';
import { OfertaService } from './oferta';

describe('OfertaService', () => {
  it('should be created', () => {
    TestBed.configureTestingModule({});
    const servicio = TestBed.inject(OfertaService);
    expect(servicio).toBeTruthy();
  });
});
