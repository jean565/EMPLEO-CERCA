import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Postular } from './postular';

describe('Postular', () => {
  let component: Postular;
  let fixture: ComponentFixture<Postular>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Postular],
    }).compileComponents();

    fixture = TestBed.createComponent(Postular);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
