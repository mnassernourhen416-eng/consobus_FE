
import { Consommation } from '@/app/models/consommation.model';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ConsommationService } from '../service/consommation.service';
@Component({
  selector: 'app-gestion-consommation',
  imports: [CommonModule, FormsModule, Button, TableModule, DialogModule, InputText],
  templateUrl: './gestion-consommation.html',
  styleUrl: './gestion-consommation.scss',
})
export class GestionConsommation {

  private consommationService = inject(ConsommationService)
  listConsommation = signal<Consommation[]>([]);
  displayCreateDialog: boolean = false;
  displayUpdateDialog = signal(false);
  displayDeleteDialog = signal(false);
  newConsommation: Partial<Consommation> = {}; // for creating a new bus
  modconsommation: Partial<Consommation> = {};
  supconsommation: Partial<Consommation> = {};

  ngOnInit() {
    this.consommationService.getAllConsommation().subscribe({
      next: (response) => {
        this.listConsommation.set(response.map(consommation => ({
          ...consommation,
          date: new Date(consommation.date)
        })));
        console.log('All Consommation:', response);
      },
      error: (error) => {
        console.error('Failed to fetch consommations:', error);
      }
    });
  }
  createConsommation() {
    if (this.newConsommation.valeur && this.newConsommation.type && this.newConsommation.date && this.newConsommation.busId) {
      const payload: Consommation = {
        id: 0, // sera ignoré par backend
        busId: Number(this.newConsommation.busId),
        valeur: Number(this.newConsommation.valeur),
        type: this.newConsommation.type,
        date: new Date(this.newConsommation.date as any),
      };

      console.log("Payload envoyé:", payload);
      console.log("Types:", typeof payload.busId, typeof payload.valeur);
      this.consommationService.createConsommation(payload).subscribe({
        next: (response) => {
          console.log('Consommation created:', response);
          this.listConsommation.update(consommations => [...consommations,
          {
            ...response,
            date: new Date(response.date)
          }]); // Update the signal state
          this.displayCreateDialog = false;
          this.newConsommation = {}; // Reset form
        },
        error: (error) => {
          console.error('Failed to create consommation:', error);
        }
      });
    } else {
      console.warn('Please fill in all required fields');
    }
  }

  showUpdateDialog(consommation: Consommation) {
    this.modconsommation = consommation
    this.displayUpdateDialog.set(true);
  }
  updateConsommation() {
    if (this.modconsommation.id && this.modconsommation.date && this.modconsommation.type && this.modconsommation.valeur && this.modconsommation.busId) {
      const payload = {
        ...this.modconsommation,
        busId: Number(this.modconsommation.busId),
        valeur: Number(this.modconsommation.valeur),
        date: new Date(this.modconsommation.date as any)
      };
      console.log("Payload update:", payload);
      console.log("Types:", typeof payload.valeur);

      this.consommationService.updateConsommation(this.modconsommation.id, payload as Consommation).subscribe({
        next: (response) => {
          console.log('Consommation updated:', response);
          // this.listBus.update(buses => [...buses, response]); // Update the signal state
          this.displayUpdateDialog.set(false);
          this.newConsommation = {}; // Reset form
        },
        error: (error) => {
          console.error('Failed to update consommation:', error);
        }
      });
    } else {
      console.warn('Please fill in all required fields');
    }
  }
  showDeleteDialog(consommation: Consommation) {
    this.supconsommation = consommation
    this.displayDeleteDialog.set(true);
  }

  removeConsommation() {
    if (!this.supconsommation.id) {
      console.error('Consommation not found');
      return;
    }
    const id = this.supconsommation.id;
    this.consommationService.removeConsommation(this.supconsommation.id).subscribe({
      next: (response) => {
        console.log('Trajet deleted:', response);
        this.listConsommation.update(consommations => consommations.filter(consommation => consommation.id !== id));
        this.displayDeleteDialog.set(false);// Update the signal state
      },
      error: (error) => {
        console.error('Failed to delete consommation:', error);
      }
    });
  }

}
