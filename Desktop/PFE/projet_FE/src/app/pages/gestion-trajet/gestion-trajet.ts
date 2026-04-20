
import { BusContainerComponent } from "@/app/components/bus-container.component";
import { Bus, EtatBus } from "@/app/models/bus.model";
import { Trajet, Ville } from '@/app/models/trajet.model';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { BusService } from "../service/bus.service";
import { TrajetService } from '../service/trajet.service';
@Component({
  selector: 'app-gestion-trajet',
  imports: [CommonModule, FormsModule, Button, TableModule, DialogModule, InputText, BusContainerComponent, ReactiveFormsModule, SelectModule],
  templateUrl: './gestion-trajet.html',
  styleUrl: './gestion-trajet.scss',
})
export class GestionTrajet {
  private trajetService = inject(TrajetService);
  listTrajet = signal<Trajet[]>([]);
  listBus = signal<Bus[]>([]);
  listVille = Object.values(Ville);
  EtatBus = EtatBus;
  displayCreateDialog: boolean = false;
  displayUpdateDialog = signal(false);
  displayDeleteDialog = signal(false);
  newTrajet: Partial<Trajet> = {}; // for creating a new bus
  modtrajet: Partial<Trajet> = {};
  suptrajet: Partial<Trajet> = {};
  selectedBus?: Bus;
  modTrajet!: FormGroup;
  //constructor(private fb: FormBuilder) { }
  private busService = inject(BusService)
  // Sample distances between cities (in km) use enum Ville
  distances = [
    { from: Ville.Gafsa, to: Ville.Mdhilla, km: 30 },
    { from: Ville.Gafsa, to: Ville.Redeyef, km: 80 },
    { from: Ville.Gafsa, to: Ville.Moularès, km: 70 },
    { from: Ville.Gafsa, to: Ville.Metlaoui, km: 40 },
    { from: Ville.Mdhilla, to: Ville.Redeyef, km: 40 },
    { from: Ville.Mdhilla, to: Ville.Metlaoui, km: 60 },
    { from: Ville.Redeyef, to: Ville.Metlaoui, km: 80 },
  ];
  ListeVille = Object.values(Ville);
  depart: string = '';
  destination: string = '';
  kilometrage: number = 0;

  ngOnInit() {
    this.getAllBus();
  }
  // showCreateTrajetDialog() {
  //   this.displayCreateDialog = true;
  // }

  getAllBus() {
    this.busService.getAllBusWithtrajets().subscribe({
      next: (response) => {
        this.listBus.set(response);
        console.log('All Bus:', response);
      },
      error: (error) => {
        console.error('Failed to fetch buses:', error);
      }
    });
  }
  currentFilter = signal<string>('all');

  displayedColumns = ['name', 'date'];


  selectedDate: string = '2026-04-20'; // مثال اليوم

  calculateDistance(depart?: string, destination?: string) {
    console.log('Calculating distance for:', this.newTrajet.depart, this.newTrajet.destination);
    if (!depart || !destination) {
      this.kilometrage = 0;
      console.warn('Please select both depart and destination to calculate distance.');
      return;
    }
    const found = this.distances.find(d =>
      (d.from === depart && d.to === destination) ||
      (d.from === destination && d.to === depart)
    );

    this.kilometrage = found ? found.km : 0;
  }
  calculateDistanceEvent(event: any) {
    console.log(event);
    console.log('Calculating distance for:', this.depart, this.destination);
    if (!this.depart || !this.destination) {
      this.kilometrage = 0;
      console.warn('Please select both depart and destination to calculate distance.');
      return;
    }
    const found = this.distances.find(d =>
      (d.from === this.depart && d.to === this.destination) ||
      (d.from === this.destination && d.to === this.depart)
    );
    if (found) {
      console.log(`Distance found: ${found.km} km between ${found.from} and ${found.to}`);
      this.newTrajet.kilometrage = found ? found.km : 0;
    } else {
      console.warn(`No distance found between ${this.depart} and ${this.destination}`);
    }


  }
  createTrajet() {
    console.log("newTrajet =", this.newTrajet);
    if (this.depart && this.destination && this.newTrajet.date && this.newTrajet.kilometrage && this.selectedBus) {
      const payload: Partial<Trajet> = this.newTrajet = {
        busId: Number(this.selectedBus.id),
        kilometrage: Number(this.newTrajet.kilometrage),
        depart: this.depart,
        destination: this.destination,
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
          this.depart = '';
          this.destination = '';
          this.selectedBus = undefined;
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

  showCreateTrajetDialog(bus: Bus) {
    this.selectedBus = bus;
    this.newTrajet = {};
    this.newTrajet.bus = bus;

    this.depart = '';
    this.destination = '';
    this.kilometrage = 0;
    this.displayCreateDialog = true;
  }

  /*getTrajetByBusAndDate(bus: Bus): Trajet[] {
    if (!bus.trajet) {
      return [];
    }
    return bus.trajet.filter(trajet => {
      const trajetDate = new Date(trajet.date).toISOString().split('T')[0];
      const selectedDate = new Date(this.selectedDate);

    });
  }*/
}
