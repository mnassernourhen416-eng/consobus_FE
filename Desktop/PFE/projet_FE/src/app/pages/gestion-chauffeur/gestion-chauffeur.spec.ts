import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionChauffeur } from './gestion-chauffeur';

describe('GestionChauffeur', () => {
  let component: GestionChauffeur;
  let fixture: ComponentFixture<GestionChauffeur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionChauffeur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionChauffeur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
