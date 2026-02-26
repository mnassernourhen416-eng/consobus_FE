import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionConsommation } from './gestion-consommation';

describe('GestionConsommation', () => {
  let component: GestionConsommation;
  let fixture: ComponentFixture<GestionConsommation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionConsommation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionConsommation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
