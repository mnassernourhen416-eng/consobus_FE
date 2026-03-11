import { Bus } from '@/app/models/bus.model';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { BusService } from '../service/bus.service';
@Component({
  selector: 'app-gestion-bus',
  imports: [CommonModule, FormsModule, Button, TableModule, DialogModule, InputText],
  templateUrl: './gestion-bus.html',
  styleUrl: './gestion-bus.scss',
})
export class GestionBus {

  private busService = inject(BusService);
  listBus = signal<Bus[]>([]); //  signal state
  displayCreateDialog: boolean = false;
  displayUpdateDialog: boolean = false;
  dispayDeleteDialog: boolean = false;
  newBus: Partial<Bus> = {}; // for creating a new bus
  modbus: Partial<Bus> = {};
  supbus: Partial<Bus> = {};


  ngOnInit() {
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
  createBus() {
    if (this.newBus.model && this.newBus.fabricant && this.newBus.matricule) {
      this.busService.createBus(this.newBus as Bus).subscribe({
        next: (response) => {
          console.log('Bus created:', response);
          this.listBus.update(buses => [...buses, response as Bus]); // Update the signal state
          this.displayCreateDialog = false;
          this.newBus = {}; // Reset form
        },
        error: (error) => {
          console.error('Failed to create bus:', error);
        }
      });
    } else {
      console.warn('Please fill in all required fields');
    }
  }

  showUpdateDialog(bus: Bus) {
    this.modbus = bus
    this.displayUpdateDialog = true;
  }
  updateBus() {
    if (this.modbus.id && this.modbus.model && this.modbus.fabricant && this.modbus.matricule) {
      this.busService.updateBus(this.modbus.id, this.modbus as Bus).subscribe({
        next: (response) => {
          console.log('Bus updated:', response);
          this.listBus.update(buses => [...buses, response]); // Update the signal state
          this.displayUpdateDialog = false;
          this.newBus = {}; // Reset form
        },
        error: (error) => {
          console.error('Failed to update bus:', error);
        }
      });
    } else {
      console.warn('Please fill in all required fields');
    }
  }
  displayDeleteDialog: boolean = false;


  showDleteDialog(bus: Bus) {
    this.supbus = bus;
    this.displayDeleteDialog = true;
  }

  removeBus() {

    if (this.supbus.id) {   // ✅ on vérifie seulement id

      this.busService.removeBus(this.supbus.id, this.supbus as Bus).subscribe({
        next: () => {
          console.log('Bus deleted');

          // Supprimer le bus du signal (IMPORTANT)
          this.listBus.update(buses =>
            buses.filter(b => b.id !== this.supbus.id)
          );

          this.displayDeleteDialog = false;
          this.supbus = {}; // reset
        },

        error: (error) => {
          console.error('Failed to delete bus:', error);
        }
      });

    } else {
      console.warn('Bus ID missing');
    }
  }
}
