
import { Chauffeur, EtatChauffeur } from '@/app/models/chauffeur.model';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ChauffeurService } from '../service/chauffeur.service';
@Component({
  selector: 'app-gestion-chauffeur',
  imports: [CommonModule, FormsModule, Button, TableModule, DialogModule, InputText, SelectModule],
  templateUrl: './gestion-chauffeur.html',
  styleUrl: './gestion-chauffeur.scss',
})
export class GestionChauffeur {
  private chauffeurService = inject(ChauffeurService);
  listChauffeur = signal<Chauffeur[]>([]); //  signal state
  displayCreateDialog: boolean = false;
  displayUpdateDialog: boolean = false;
  dispayDeleteDialog: boolean = false;
  newChaffeur: Partial<Chauffeur> = {}; // for creating a new bus
  modChauffeur: Partial<Chauffeur> = {};
  supChauffeur: Partial<Chauffeur> = {};
  //Read from type Etat chauffeur

  lisEtatChauffeur = Object.values(EtatChauffeur);
  ngOnInit() {
    this.chauffeurService.getAllChauffeur().subscribe({
      next: (response) => {
        this.listChauffeur.set(response);
        console.log('All Chauffeur:', response);
      },
      error: (error) => {
        console.error('Failed to fetch chauffeurs:', error);
      }
    });
  }
  createChauffeur() {
    if (this.newChaffeur.nom && this.newChaffeur.prenom && this.newChaffeur.matricule && this.newChaffeur.age) {
      this.chauffeurService.createChauffeur(this.newChaffeur as Chauffeur).subscribe({
        next: (response) => {
          console.log('Chauffeur created:', response);
          this.listChauffeur.update(chauffeurs => [...chauffeurs, response]); // Update the signal state
          this.displayCreateDialog = false;
          this.newChaffeur = {}; // Reset form
        },
        error: (error) => {
          console.error('Failed to create chauffeur:', error);
        }
      });
    } else {
      console.warn('Please fill in all required fields');
    }
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

      this.chauffeurService.updateChauffeur(this.modChauffeur.id, this.modChauffeur as Chauffeur).subscribe({
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
