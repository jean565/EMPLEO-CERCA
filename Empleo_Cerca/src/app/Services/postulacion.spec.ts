import { TestBed } from '@angular/core/testing';
import { PostulacionService } from './postulacion';

describe('PostulacionService', () => {
  it('should be created', () => {
    TestBed.configureTestingModule({});
    const servicio = TestBed.inject(PostulacionService);
    expect(servicio).toBeTruthy();
  });
});
