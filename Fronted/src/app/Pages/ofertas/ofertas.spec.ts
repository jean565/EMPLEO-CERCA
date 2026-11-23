import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Ofertas } from './ofertas';

describe('Ofertas', () => {
  let component: Ofertas;
  let fixture: ComponentFixture<Ofertas>;

  beforeEach(async () => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
    await TestBed.configureTestingModule({
      imports: [Ofertas],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(Ofertas);
    component = fixture.componentInstance;
    TestBed.inject(HttpTestingController).match(() => true).forEach(peticion => peticion.flush([]));
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
