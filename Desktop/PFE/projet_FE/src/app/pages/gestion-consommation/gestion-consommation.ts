
import { Bus } from '@/app/models/bus.model';
import { Consommation, TypeConsommation } from '@/app/models/consommation.model';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from "primeng/button";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { BusService } from '../service/bus.service';
import { ConsommationService } from '../service/consommation.service';
// Source - https://stackoverflow.com/q/47390727
// Posted by Lukozaver
// Retrieved 2026-04-02, License - CC BY-SA 3.0


@Component({
  selector: 'app-gestion-consommation',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Button, TableModule, DialogModule, InputText, DataViewModule, SelectButtonModule, ToggleButtonModule, SelectModule, MultiSelectModule],
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
  constructor(private fb: FormBuilder) { }
  private consommationService = inject(ConsommationService)
  private busService = inject(BusService)


  listConsommation = signal<Consommation[]>([]);
  listMultipleConsommation = signal<Bus[]>([]);

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


  ngOnInit() {


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


  getAllConsommation() {
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

  applyFilter(type: string) {
    this.currentFilter.set(type);
    // Déclenche le filterPredicate
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
      type: formValue.type,
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
      },
      error: (error) => {
        console.error('Failed to create consommation:', error);
      }
    });
  }
  // createMultipleConsommation() {
  // Vérifie que le formulaire est complet et que plusieurs bus sont sélectionnés


  // Crée un payload pour chaque bus sélectionné
  //const payload: Partial<Consommation>[] = this.listConsommation().map(consommation => ({
  //  busId: Number(consommation.busId),
  //  valeur: Number(consommation.valeur),
  //type: consommation.type,
  //date: new Date(consommation.date as any)
  //}))
  // {

  //   busId: Number(this.selectedBusIds.id),
  //   valeur: Number(this.newConsommation.valeur),
  //   type: this.newConsommation.type,
  //   date: new Date(this.newConsommation.date as any),
  // };

  //console.log("Payload envoyé:", payload);

  // Appel au service createMultipleConsommation
  // this.consommationService.createMultipleConsommation(payload).subscribe({
  //next: (responses) => {
  // console.log('Consommations créées:', responses);

  // Met à jour le signal ou le tableau de consommations
  // this.listConsommation.update(consommations => [
  // ...consommations,
  // ...responses.map(r => ({
  //  ...r,
  // date: new Date(r.date)
  //  }))
  // ]);

  // Ferme les dialogs et reset le formulaire
  //   this.displayCreateDialog = false;
  //  this.displayMultipleDialog = false;
  // this.newConsommation = {};

  //},
  // error: (error) => {
  // console.error('Échec de création des consommations:', error);
  //  }
  //  });


  //}


  /*   createMultipleConsommation() {
  
      const createList: Partial<Consommation>[] = [];
      const updateRequests: any[] = [];
  
      const existingCons = this.listConsommation();
  
      existingCons.forEach(cons => {
  
        const valeur = Number(cons.valeur) || 0; //
  
        const payload = {
          busId: cons.busId,
          valeur: valeur,
          type: cons.type,
          date: new Date(cons.date as any)
        };
  
  
        if (!cons.newConsommation && cons.id !== undefined) {
          updateRequests.push(
            this.consommationService.updateConsommation(cons.id, payload)
          );
        }
  
  
        if (cons.newConsommation) {
          createList.push({
            busId: cons.busId,
            valeur: Number(cons.newConsommation.valeur),
            type: this.newConsommation.type as TypeConsommation,
            date: new Date(cons.date as any)
          });
        }
  
      });
  
      const requests: any[] = [];
  
  
      if (createList.length > 0) {
        requests.push(
          this.consommationService.createMultipleConsommation(createList)
        );
      }
  
  
      requests.push(...updateRequests);
  
      if (requests.length === 0) {
        console.log(' Nothing to save');
        return;
      }
  
      forkJoin(requests).subscribe({
        next: (res) => {
          console.log(' create + update done', res);
  
  
          this.loadBusConsommation();
  
  
          this.displayMultipleDialog = false;
          this.displayCreateDialog = false;
          this.newConsommation = {};
        },
        error: (err) => {
          console.error(' error', err);
        }
      });
  
    } */


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
      type: formValue.type,
      date: new Date(formValue.date)
    };
    console.log("Payload update:", payload);
    console.log("Types:", typeof payload.busId, typeof payload.valeur);

    this.consommationService.updateConsommation(this.modconsommation.id, payload).subscribe({

      next: (response) => {
        console.log('Consommation updated:', response);

        if (!response) {
          console.error('Consommation not found')
          return;
        }
        this.listConsommation.update(consommations => consommations.map(c => c.id === response.id ? response : c));  // Update the signal state
        this.displayUpdateDialog.set(false);
        this.modconsommationForm.reset();// Reset form
      },
      error: (error) => {
        console.error('Failed to update consommation:', error);
      }
    });
    // } else {
    //  console.warn('Please fill in all required fields');
    //}
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
      case 'jour':
        this.labelDate = "Date";
        break;
      case 'semaine':
        this.labelDate = "Début de semaine";
        break;
      case 'mois':
        this.labelDate = "Mois";
        break;

      default:
        this.labelDate = "Date";
    }
    this.newConsommation.type = event.value;
  }

  loadBusConsommation() {
    if (!this.newConsommation.type || !this.newConsommation.date) {
      return;
    }
    let monthDate = new Date(this.newConsommation.date);
    if (this.newConsommation.type === TypeConsommation.mois) {
      monthDate.setDate(1); // Set to first day of the month
    }
    //let monthToSend = this.newConsommation.type === TypeConsommation.mois ? monthDate : this.newConsommation.date;
    //console.log("monthDate", monthDate);
    //fromatdate to this format dd-mm-yyyy
    //const formattedDate = monthToSend.toISOString().split('T')[0];
    const formattedDate =
      monthDate.getFullYear() +
      "-" +
      String(monthDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(monthDate.getDate()).padStart(2, "0");



    console.log("formattedDate", formattedDate);

    this.busService.getAllbyTypeConso_Date(
      this.newConsommation.type,
      formattedDate
    ).subscribe({

      next: (data) => {
        this.listMultipleConsommation.set(data);
        this.updateNewConsommationMap(); // Update the map with the new data
        // const result: Consommation[] = data.map(bus => ({
        //   // nouvelle consommation
        //   busId: bus.id,
        //   valeur: bus.consommation ?? 0,
        //   type: this.newConsommation.type as TypeConsommation,
        //   date: new Date(this.newConsommation.date as any),
        //   bus: {
        //     id: bus.id,
        //     matricule: bus.matricule
        //   }
        // }));

        // this.listConsommation.set(result);
        console.log("Bus + consommation:", data);

      },

      error: (err) => {
        console.error("Erreur chargement bus:", err);
      }

    });

  }
  updateNewConsommationMap() {
    //update the map from the listConsommation signal
    const currentConsommations = this.listMultipleConsommation();
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
    this.updateNewConsommationMap();

  }
  HideAjouterConsoMultipleDialog() {
    this.displayMultipleDialog = false;
    this.newConsommationMap = {};
  }

  createMultipleConsommation() {
    console.log(this.newConsommationMap);
    //check if the bus has already a consommation for the selected date and type
    //if it we gonna call update request
    let payload: Partial<Consommation>[] = Object.entries(this.newConsommationMap).map(([busId, valeur]) => ({
      busId: Number(busId),
      valeur: Number(valeur),
      type: this.newConsommation.type as TypeConsommation,
      date: new Date(this.newConsommation.date as any)
    }));
    //filter the items with valeur 0
    payload = payload.filter((c) => c.valeur !== 0);
    console.log(payload);
    this.consommationService.createMultipleConsommation(payload).subscribe({
      next: (response) => {
        console.log('Consommations created:', response);
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
