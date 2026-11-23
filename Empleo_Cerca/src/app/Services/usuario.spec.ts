import { TestBed } from '@angular/core/testing';
import { UsuarioService } from './usuario';

describe('UsuarioService', () => {
  it('should be created', () => {
    TestBed.configureTestingModule({});
    const servicio = TestBed.inject(UsuarioService);
    expect(servicio).toBeTruthy();
  });
});
