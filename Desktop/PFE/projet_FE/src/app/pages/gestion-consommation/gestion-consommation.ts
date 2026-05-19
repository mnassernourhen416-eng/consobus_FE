
import { Bus } from '@/app/models/bus.model';
import { Consommation, TypeConsommation } from '@/app/models/consommation.model';
import { User } from '@/app/models/user.model';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from "primeng/button";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AuthService } from '../service/auth.service';
import { BusService } from '../service/bus.service';
import { ConsommationService } from '../service/consommation.service';

@Component({
  selector: 'app-gestion-consommation',
  imports: [IconFieldModule, InputIconModule, CommonModule, ReactiveFormsModule, FormsModule, Button, TableModule, DialogModule, InputText, DataViewModule, SelectButtonModule, ToggleButtonModule, SelectModule, MultiSelectModule],
  templateUrl: './gestion-consommation.html',
  styleUrl: './gestion-consommation.scss',
})
export class GestionConsommation {
  //exportExcel() {


  //throw new Error('Method not implemented.');
  //}
  dt: any;

  // A temporary map to hold new values keyed by bus id
  newConsommationMap: { [busId: number]: number } = {};
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }
  private consommationService = inject(ConsommationService)
  private busService = inject(BusService)
  private authService = inject(AuthService);


  listConsommation = signal<Consommation[]>([]);
  listMultipleConsommation = signal<Bus[]>([]);
  listBusWithConsommation = signal<Bus[]>([]);

  displaySimpleMultipleButtons = false;
  displaySimpleDialog: boolean = false;
  displayMultipleDialog = false;
  displayCreateDialog: boolean = false;
  displayUpdateDialog = signal(false);
  displayDeleteDialog = signal(false);
  newConsommation: Partial<Consommation> = {}; // for creating a new bus
  modconsommation: Partial<Consommation> = {};
  supconsommation: Partial<Consommation> = {};
  listTypeConsommation = Object.values(TypeConsommation);
  selectedBus?: Bus;
  listBus = signal<Bus[]>([]);
  selectedBusIds?: Bus;
  labelDate = "Date";
  consForm!: FormGroup;
  modconsommationForm!: FormGroup;
  multiConsForm!: FormGroup;
  selectedTypeconsommation: TypeConsommation = TypeConsommation.jour;
  myListTypeConso = [
    { name: "Jour", value: TypeConsommation.jour },
    { name: "Semaine", value: TypeConsommation.semaine },
    { name: "Mois", value: TypeConsommation.mois }
  ]

  currentUser: User | undefined;
  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    console.log(this.listTypeConsommation);

    this.consForm = this.fb.group({
      bus: [null, Validators.required],
      date: [null, Validators.required],
      valeur: [null, [Validators.required, Validators.min(0)]],
      type: [null, Validators.required]
    });
    this.modconsommationForm = this.fb.group({
      busId: [null, Validators.required],
      date: [null, Validators.required],
      valeur: [null, [Validators.required, Validators.min(0)]],
      type: [null, Validators.required]
    });
    this.getAllBus();
    this.getAllConsommation();
  }
  selectedType?: string;
  dateOptions: { label: string, value: string }[] = [];
  selectedDate?: string;

  // === Methods ===

  filteredConsommation = signal<Consommation[]>([]);





  getAllConsommation() {
    this.consommationService.getAllConsommation().subscribe({
      next: (response) => {
        this.listConsommation.set(response.map(consommation => ({
          ...consommation,
          date: new Date(consommation.date)
        })));
        console.log('All Consommation:', response);
        this.filteredConsommation.set(this.listConsommation());
      },
      error: (error) => {
        console.error('Failed to fetch consommations:', error);
      }
    });
    this.listConsommation.set([]);

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
  currentFilter = signal<string>('all');

  displayedColumns = ['name', 'date'];
  resetForm() {
    this.consForm.reset();
    this.consForm.markAsPristine();
    this.consForm.markAsUntouched();
  }

  createConsommationSimple() {
    if (this.consForm.invalid) {
      this.consForm.markAllAsTouched();
      return;
    }

    let formValue = this.consForm.value;

    const payload = {
      busId: formValue.bus.id,
      valeur: Number(formValue.valeur),
      type: formValue.type.toString().toLowerCase(),
      date: new Date(formValue.date)
    };

    console.log("Payload envoyé:", payload);
    console.log("Types:", typeof payload.busId, typeof payload.valeur);
    this.consommationService.createSimpleConsommation(payload).subscribe({
      next: (response) => {
        console.log('Consommation created:', response);
        this.listConsommation.update(consommations => [...consommations,
        {
          ...response,
          date: new Date(response.date)
        }]); // Update the signal state
        this.displayCreateDialog = false;
        this.displaySimpleDialog = false;
        this.newConsommation = {}; // Reset form
        this.consForm.reset();
        this.getAllConsommation();

        this.loadBusConsommationinTable();
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Failed to create consommation:', error);
      }
    });
  }




  searchConsommationByDate() {
    if (!this.newConsommation.date) return;
    const selectedDate = new Date(this.newConsommation.date).toDateString();
    const filtered = this.listConsommation().filter(c => new Date(c.date).toDateString() === selectedDate);
    this.listConsommation.set(filtered);
  }

  showUpdateDialog(consommation: Consommation) {

    this.modconsommation = consommation
    this.modconsommationForm.setValue({
      busId: consommation.busId,
      date: new Date(consommation.date),
      type: consommation.type,
      valeur: consommation.valeur
    });
    this.changeLabelDate({ value: consommation.type });
    this.displayUpdateDialog.set(true);
  }
  updateConsommation() {
    if (this.modconsommationForm.invalid) {
      this.modconsommationForm.markAllAsTouched();
      return;
    }
    if (!this.modconsommation.id) return;
    let formValue = this.modconsommationForm.value;
    console.log(formValue);

    const payload = {
      busId: Number(formValue.busId),
      valeur: Number(formValue.valeur),
      type: formValue.type.toLowerCase(),
      date: new Date(formValue.date)
    };
    console.log("Payload update:", payload);
    console.log("Types:", typeof payload.busId, typeof payload.valeur);

    this.consommationService.updateConsommation(this.modconsommation.id, payload).subscribe({

      next: (response) => {
        console.log('Consommation updated:', response);
        const bus = this.listBus().find(b => b.id === response.busId);
        const updatedConsommation = {
          ...response,
          bus: bus,
          date: new Date(response.date)
        };

        if (!response) {
          console.error('Consommation not found')
          return;
        }
        this.listConsommation.update(consommations => consommations.map(c => c.id === response.id ? updatedConsommation : c));  // Update the signal state
        this.displayUpdateDialog.set(false);
        this.modconsommationForm.reset();// Reset form
      },
      error: (error) => {
        console.error('Failed to update consommation:', error);
      }
    });

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

  changeLabelDate(event: any) {
    console.log("changeLabelDate", event);
    switch (event.value) {
      case 'Jour':
        this.labelDate = "Date";
        break;
      case 'Semaine':
        this.labelDate = "Début de semaine";
        break;
      case 'Mois':
        this.labelDate = "Mois";
        break;

      default:
        this.labelDate = "Date";
    }
    this.selectedTypeconsommation = event.value;
    this.newConsommation.type = event.value;
    // if (this.newConsommation.date) {
    //   this.loadBusConsommation();
    // }
  }
  mapBusToConsommation(data: Bus[]) {
    return data.flatMap(bus => (bus.consommation || []).map(c => ({
      ...c,
      bus: bus
    })));
  }

  loadBusConsommation() {
    if (!this.newConsommation.type || !this.newConsommation.date) {
      return;
    }
    let monthDate = new Date(this.newConsommation.date);
    if (this.newConsommation.type === TypeConsommation.mois) {
      monthDate.setDate(1);
    }


    const formattedDate =
      monthDate.getFullYear() +
      "-" +
      String(monthDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(monthDate.getDate()).padStart(2, "0");



    console.log("formattedDate", formattedDate);

    this.busService.getAllbyTypeConso_Date(
      this.newConsommation.type.toLowerCase(),
      formattedDate
    ).subscribe({

      next: (data) => {
        this.listMultipleConsommation.set(data);
        const mapped = this.mapBusToConsommation(data);
        this.listConsommation.set(mapped);
        this.updateNewConsommationMap(this.listMultipleConsommation()); // Update the map with the new data

        console.log("Bus + consommation:", data);

      },

      error: (err) => {
        console.error("Erreur chargement bus:", err);
      }

    });

  }

  loadBusConsommationinTable() {
    if (this.selectedDate == undefined) return;
    let monthDate = new Date(this.selectedDate);
    if (this.selectedTypeconsommation === TypeConsommation.mois) {
      monthDate.setDate(1);
    }


    const formattedDate =
      monthDate.getFullYear() +
      "-" +
      String(monthDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(monthDate.getDate()).padStart(2, "0");



    console.log("formattedDate", formattedDate);

    this.busService.getAllbyTypeConso_Date(
      this.selectedTypeconsommation.toLowerCase(),
      formattedDate
    ).subscribe({

      next: (data) => {
        this.listBusWithConsommation.set(data);
        const mapped = this.mapBusToConsommation(data);
        this.listConsommation.set(mapped);
        this.updateNewConsommationMap(this.listBusWithConsommation()); // Update the map with the new data
        console.log("Bus + consommation:", data);

      },

      error: (err) => {
        console.error("Erreur chargement bus:", err);
      }

    });

  }
  loadConsommation() {
    if (!this.selectedTypeconsommation || !this.selectedDate) {
      return;
    }
    let monthDate = new Date(this.selectedDate);
    if (this.selectedTypeconsommation === TypeConsommation.mois) {
      monthDate.setDate(1);
    }


    const formattedDate =
      monthDate.getFullYear() +
      "-" +
      String(monthDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(monthDate.getDate()).padStart(2, "0");



    console.log("formattedDate", formattedDate);

    this.busService.getAllbyTypeConso_Date(
      this.selectedTypeconsommation.toLowerCase(),
      formattedDate
    ).subscribe({

      next: (data) => {
        this.listConsommation.set(data.flatMap(bus => bus.consommation || []));
        // Update the map with the new data

        console.log("Bus + consommation:", this.listConsommation());

      },

      error: (err) => {
        console.error("Erreur chargement bus:", err);
      }

    });

  }
  updateNewConsommationMap(listBusWithConsommation: Bus[]) {
    //update the map from the listConsommation signal
    const currentConsommations = listBusWithConsommation;
    this.newConsommationMap = {};
    currentConsommations.forEach(bus => {
      this.newConsommationMap[bus.id] = bus.consommation?.[0]?.valeur || 0;
    });
    console.log(this.newConsommationMap);
  }
  showAjouterConoMultipleDialog() {
    this.displayMultipleDialog = true;
    this.newConsommation.type = TypeConsommation.jour; // Par défaut, on peut changer selon le besoin
    this.newConsommation.date = undefined;
    this.listMultipleConsommation.set([]);
    this.updateNewConsommationMap(this.listMultipleConsommation());
    this.selectedTypeconsommation = TypeConsommation.jour;
    // this.selectedDate = undefined;
    this.listConsommation.set([]);

  }
  showAjouterConsoDialog(bus: Bus) {
    const formattedDate = this.selectedDate ? new Date(this.selectedDate) : new Date(Date.now());
    console.log("--- DAte: ", formattedDate);

    //patch the consform with bus id and current date and bus
    this.consForm.patchValue({
      bus: bus,
      date: formattedDate,
      type: this.selectedTypeconsommation,
    });
    this.displaySimpleDialog = true;

  }
  HideAjouterConsoMultipleDialog() {
    this.displayMultipleDialog = false;
    this.newConsommationMap = {};
  }

  createMultipleConsommation() {

    let payload: Partial<Consommation>[] = Object.entries(this.newConsommationMap).map(([busId, valeur]) => ({
      busId: Number(busId),
      valeur: Number(valeur),
      type: this.newConsommation.type?.toLowerCase() as TypeConsommation,
      date: new Date(this.newConsommation.date as any)
    }));

    payload = payload.filter((c) => c.valeur !== 0);
    console.log(payload);
    this.consommationService.createMultipleConsommation(payload).subscribe({
      next: (response) => {
        console.log('Consommations created:', response);

        if (this.selectedTypeconsommation && this.selectedDate) {
          this.loadConsommation();
        } else {
          this.getAllConsommation();
        }
        this.loadBusConsommation();
        this.displayMultipleDialog = false;
        this.newConsommationMap = {};
      },
      error: (error) => {
        console.error('Failed to create consommations:', error);
      }
    });

  }
  onNewConsommation(bus: any, event: any): void {
    console.log(event);
    const value = event.value;

    if (value !== null && value !== undefined) {
      // Initialize the consommation array if needed
      if (!bus.consommation) {
        bus.consommation = [];
      }

      // Either push a new entry or update the map
      const existing = bus.consommation.find((c: any) => c.busId === bus.id);
      if (!existing) {
        bus.consommation.push({ busId: bus.id, valeur: value });
      } else {
        existing.valeur = value;
      }
    }
  }
}
