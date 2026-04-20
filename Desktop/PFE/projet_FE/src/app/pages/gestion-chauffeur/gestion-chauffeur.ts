
import { Bus } from '@/app/models/bus.model';
import { Chauffeur, EtatChauffeur } from '@/app/models/chauffeur.model';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from "primeng/button";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BusService } from '../service/bus.service';
import { ChauffeurService } from '../service/chauffeur.service';
@Component({
  selector: 'app-gestion-chauffeur',
  imports: [CommonModule, FormsModule, Button, TableModule, DialogModule, InputText, SelectModule, DataViewModule, ReactiveFormsModule, IconField, InputIcon],
  templateUrl: './gestion-chauffeur.html',
  styleUrl: './gestion-chauffeur.scss',
})
export class GestionChauffeur {
  dt: any;
  listBus = signal<Bus[]>([]);
  selectedBusIds?: Bus;
  selectedBus?: Bus;
  cols: any;
  constructor(private fb: FormBuilder) { }
  private chauffeurService = inject(ChauffeurService);
  private busService = inject(BusService)
  listChauffeur = signal<Chauffeur[]>([]); //  signal state
  displayCreateDialog: boolean = false;
  displayUpdateDialog: boolean = false;
  dispayDeleteDialog: boolean = false;
  newChaffeur: Partial<Chauffeur> = {}; // for creating a new bus
  modChauffeur: Partial<Chauffeur> = {};
  supChauffeur: Partial<Chauffeur> = {};
  //Read from type Etat chauffeur

  lisEtatChauffeur = Object.values(EtatChauffeur);

  chauForm!: FormGroup;
  ngOnInit() {


    this.chauForm = this.fb.group({
      matricule: [null, [Validators.required], [this.cpgMatiriculeValidator()]],
      prenom: [null, Validators.required],
      nom: [null, Validators.required],
      age: [null, [Validators.required, Validators.min(18)]]

    });
    this.chauffeurService.getAllChauffeur().subscribe({
      next: (response) => {
        this.listChauffeur.set(response);
        console.log('All Chauffeur:', response);
      },
      error: (error) => {
        console.error('Failed to fetch chauffeurs:', error);
      }
    });
    this.getAllBus();
  }
  getAllBus() {
    this.busService.getAllBus().subscribe({
      next: (response) => {
        this.listBus.set(response);
        console.log('All Bus:', response);
      },
      error: (error) => {
        console.error('Failed to fetch buses:', error);
      }
    });

  }
  cpgMatiriculeValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null); // No value, so no error
      }
      return this.chauffeurService.checkCPGMatricule(control.value).pipe(map(res => (res.exists ? null :
        { matriculeNotInCPG: true }
      )),
        catchError(() => of(null)) // In case of error, consider it valid
      );
    };
  }
  createChauffeur() {
    if (this.chauForm.invalid) {
      this.chauForm.markAllAsTouched();
      return;
    }

    let formValue = this.chauForm.value;

    //if (this.newChaffeur.nom && this.newChaffeur.prenom && this.newChaffeur.matricule && this.newChaffeur.age) {
    this.chauffeurService.createChauffeur(formValue).subscribe({
      next: (response) => {
        console.log('Chauffeur created:', response);
        this.listChauffeur.update(chauffeurs => [...chauffeurs, response]); // Update the signal state
        this.displayCreateDialog = false;
        this.newChaffeur = {};
        this.chauForm.reset(); // Reset form
      },
      error: (error) => {
        console.error('Failed to create chauffeur:', error);
      }
    });
    //  } else {
    console.warn('Please fill in all required fields');
    // }
  }

  showUpdateDialog(chauffeur: Chauffeur) {
    this.modChauffeur = chauffeur
    this.displayUpdateDialog = true;
  }
  updateChauffeur() {
    if (this.modChauffeur.id && this.modChauffeur.nom
      && this.modChauffeur.prenom && this.modChauffeur.matricule
      && this.modChauffeur.age && this.modChauffeur.etat) {


      console.log("this.modChauffeur: ", this.modChauffeur);

      this.chauffeurService.updateChauffeur(this.modChauffeur.id!, this.modChauffeur as Chauffeur).subscribe({
        next: (response) => {
          console.log('Chauffeur updated:', response);
          //update the signal
          this.listChauffeur.update(chauffeurs => chauffeurs.map(chauffeur => chauffeur.id === response.id ? response : chauffeur));

          // this.listChauffeur.update(chauffeurs => [...chauffeurs, response]); // Update the signal state
          this.displayUpdateDialog = false;
          this.modChauffeur = {}; // Reset form
        },
        error: (error) => {
          console.error('Failed to update chauffeur:', error);
        }
      });
    } else {
      console.warn('Please fill in all required fields');
    }
  }
  showDleteDialog(chauffeur: Chauffeur) {
    this.supChauffeur = chauffeur;
    this.dispayDeleteDialog = true;
  }
  //remove chauffeur
  removeChauffeur() {
    if (!this.supChauffeur.id) {
      console.error('Invalid chauffeur ID');
      return;
    }
    const id = this.supChauffeur.id;
    this.chauffeurService.removeChauffeur(this.supChauffeur.id).subscribe({
      next: (response) => {
        console.log('Chauffeur deleted:', response);
        this.listChauffeur.update(chauffeurs => chauffeurs.filter(chauffeur => chauffeur.id !== id)); // Update the signal state
        this.dispayDeleteDialog = false;

      },
      error: (error) => {
        console.error('Failed to delete chauffeur:', error);
        this.dispayDeleteDialog = false;

      }
    });
  }


}
