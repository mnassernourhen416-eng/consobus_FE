
import { ApprovalCardComponent } from "@/app/components/approval-card.component";
import { Trajet } from '@/app/models/trajet.model';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TrajetService } from '../service/trajet.service';
@Component({
  selector: 'app-gestion-trajet',
  imports: [CommonModule, FormsModule, Button, TableModule, DialogModule, InputText, ApprovalCardComponent],
  templateUrl: './gestion-trajet.html',
  styleUrl: './gestion-trajet.scss',
})
export class GestionTrajet {
  private trajetService = inject(TrajetService);
  listTrajet = signal<Trajet[]>([]);
  displayCreateDialog: boolean = false;
  displayUpdateDialog = signal(false);
  displayDeleteDialog = signal(false);
  newTrajet: Partial<Trajet> = {}; // for creating a new bus
  modtrajet: Partial<Trajet> = {};
  suptrajet: Partial<Trajet> = {};

  ngOnInit() {
    this.trajetService.getAllTrajet().subscribe({
      next: (response) => {
        this.listTrajet.set(response.map(trajet => ({
          ...trajet,
          date: new Date(trajet.date)
        })));
        console.log('All Trajet:', response);
      },
      error: (error) => {
        console.error('Failed to fetch consommations:', error);
      }
    });
  }
  createTrajet() {
    console.log("newTrajet =", this.newTrajet);
    if (this.newTrajet.depart && this.newTrajet.destination && this.newTrajet.date && this.newTrajet.kilometrage && this.newTrajet.busId !== null && this.newTrajet.busId !== undefined) {
      const payload: Trajet = {
        id: 0, // sera ignoré par backend
        busId: Number(this.newTrajet.busId),
        kilometrage: Number(this.newTrajet.kilometrage),
        depart: this.newTrajet.depart!,
        destination: this.newTrajet.destination!,
        date: new Date(this.newTrajet.date as any),
      };

      console.log("Payload envoyé:", payload);
      console.log("Types:", typeof payload.busId);
      this.trajetService.createTrajet(payload).subscribe({
        next: (response) => {
          console.log('TRAJET created:', response);
          this.listTrajet.update(trajets => [...trajets,
          {
            ...response,
            date: new Date(response.date)
          }]); // Update the signal state
          this.displayCreateDialog = false;
          this.newTrajet = {}; // Reset form
        },
        error: (error) => {
          console.error('Failed to create consommation:', error);
        }
      });
    } else {
      console.warn('Please fill in all required fields');
    }
  }

  showUpdateDialog(trajet: Trajet) {
    this.modtrajet = trajet
    this.displayUpdateDialog.set(true);
  }
  updateTrajet() {
    if (this.modtrajet.id && this.modtrajet.depart && this.modtrajet.destination && this.modtrajet.date && this.modtrajet.kilometrage && this.modtrajet.busId !== null && this.modtrajet.busId !== undefined) {
      const payload = {
        ...this.modtrajet,
        busId: Number(this.modtrajet.busId),
        kilometrage: Number(this.modtrajet.kilometrage),
        date: new Date(this.modtrajet.date as any)
      };
      console.log("Payload update:", payload);
      console.log("Types:", typeof payload.kilometrage);

      this.trajetService.updateTrajet(this.modtrajet.id, payload as Trajet).subscribe({
        next: (response) => {
          console.log('Trajet updated:', response);
          // this.listBus.update(buses => [...buses, response]); // Update the signal state
          this.displayUpdateDialog.set(false);
          this.newTrajet = {}; // Reset form
        },
        error: (error) => {
          console.error('Failed to update trajet:', error);
        }
      });
    } else {
      console.warn('Please fill in all required fields');
    }
  }
  showDeleteDialog(trajet: Trajet) {
    this.suptrajet = trajet;
    this.displayDeleteDialog.set(true);
  }

  // suprimer trajet 
  removeTrajet() {
    if (!this.suptrajet.id) {
      console.error('Trajet not found');
      return;
    }
    const id = this.suptrajet.id;
    this.trajetService.removeTrajet(this.suptrajet.id).subscribe({
      next: (response) => {
        console.log('Trajet deleted:', response);
        this.listTrajet.update(trajets => trajets.filter(trajet => trajet.id !== id));
        this.displayDeleteDialog.set(false);// Update the signal state
      },
      error: (error) => {
        console.error('Failed to delete trajet:', error);
      }
    });
  }


}
