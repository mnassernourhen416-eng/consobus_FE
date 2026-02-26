import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTrajet } from './gestion-trajet';

describe('GestionTrajet', () => {
  let component: GestionTrajet;
  let fixture: ComponentFixture<GestionTrajet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionTrajet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionTrajet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
