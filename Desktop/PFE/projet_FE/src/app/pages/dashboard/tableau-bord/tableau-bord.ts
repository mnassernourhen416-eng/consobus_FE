import { DashboardStats, TrajetStats } from '@/app/models/dashboardstats';
import { Ville } from '@/app/models/trajet.model';
import { User } from '@/app/models/user.model';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from "primeng/chart";
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { TableauBordService } from '../../service/tableau-bord.service';

@Component({
  selector: 'app-tableau-bord',
  imports: [DatePickerModule, CardModule, ButtonModule, CommonModule, ChartModule, SelectModule, FormsModule],
  templateUrl: './tableau-bord.html',
  styleUrl: './tableau-bord.scss',
})
export class TableauBord {
  private TableauBordService = inject(TableauBordService);
  private authService = inject(AuthService)
  stats: DashboardStats | undefined = undefined;

  // layoutService = inject(LayoutService);
  chartData = signal<any>(null);

  chartOptions = signal<any>(null);
  charttData = signal<any>(null);

  charttOptions = signal<any>(null);
  labelDate = "Date";
  listeTypesDate = [
    { label: 'Semaine', value: 'semaine' },
    { label: 'Mois', value: 'mois' },
    { label: 'annee', value: 'annee' }
  ];
  ListeVille = Object.values(Ville);
  TrajetStats?: TrajetStats;
  depart: string = 'Gafsa';
  destination: string = 'Metlaoui';
  selectedType: string = 'mois';
  dateOptions: { label: string, value: string }[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0].slice(0, 7);
  showAdvancedStats: boolean = false;
  totalTrajets: number = 0;
  trajet_Depart_Destination: number = 0;
  trajetsStats$!: Observable<any>;
  currentUser: User | undefined;
  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.getStat();
    this.getConsommationLastMonth();
    this.getTrajetsLastMonth();
    this.loadTrajetsStats();
    // this.getTrajetsStats();
  }
  // getTrajetsStats() {

  //   this.TableauBordService.getTrajetsStats({
  //     type: this.selectedType as 'semaine' | 'mois' | 'annee',
  //     date: this.selectedDate,  // Pass the selected date here      
  //     depart: this.depart,
  //     destination: this.destination
  //   }).subscribe({
  //     next: (response) => {
  //       // const labels = response.map(item => item.trajets_type_Date_depart_destination);
  //       // const values = response.map(item => item.totalTrajets);
  //       console.log('Trajets Stats:', response);
  //       // this.initChart(labels, values);
  //       console.log('Trajets Stats:', response);

  //       this.TrajetStats = response;
  //       // Handle the response for last month's trajets
  //     },
  //     error: (error) => {
  //       console.error('Failed to fetch last month\'s trajets:', error);
  //     }
  //   })
  // }

  getStat() {
    this.TableauBordService.getTableauBord().subscribe({
      next: (response) => {
        this.stats = response;
        console.log('All Bus:', response);
      },
      error: (error) => {
        console.error('Failed to fetch buses:', error);
      }
    })
  }
  getConsommationLastMonth() {
    this.TableauBordService.getConsommationLastMonth().subscribe({
      next: (response) => {
        const labels = response.map(item => item.busMatricule);
        const values = response.map(item => item.totalConsommation);
        console.log('Last Month Consumption:', response);
        this.initChart(labels, values);
        // Handle the response for last month's consumption
      },
      error: (error) => {
        console.error('Failed to fetch last month\'s consumption:', error);
      }
    })
  }
  initChart(labels: string[], values: number[]) {

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');
    this.charttData.set({
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: 'Consommation (L)',
          data: values,
          backgroundColor: documentStyle.getPropertyValue('--primary-500') || '#007bff',
          borderColor: documentStyle.getPropertyValue('--primary-500') || '#007bff',
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 20,
          hoverBackgroundColor: documentStyle.getPropertyValue('--primary-500') || '#007bff',
          hoverBorderColor: documentStyle.getPropertyValue('--primary-500') || '#007bff',
        },
      ],
    });
    this.charttOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
          },
          grid: {
            color: borderColor,
            display: false,
          },
        },
        y: {
          ticks: {
            color: textMutedColor,
          },
          grid: {
            color: borderColor,
          },
        },
      },
    });

  }
  getTrajetsLastMonth() {
    this.TableauBordService.getTrajetsLastMonth().subscribe({
      next: (response) => {
        const labels = response.map(item => item.busMatricule);
        const values = response.map(item => item.totalTrajets);
        console.log('Last Month Trajets:', response);
        this.initChartt(labels, values);
        // Handle the response for last month's trajets
      },
      error: (error) => {
        console.error('Failed to fetch last month\'s trajets:', error);
      }
    })
  }
  initChartt(labels: string[], values: number[]) {

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');
    this.chartData.set({
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: 'Trajets',
          data: values,
          backgroundColor: documentStyle.getPropertyValue('--primary-500') || '#cc3f96',
          borderColor: documentStyle.getPropertyValue('--primary-500') || '#cc3f96',
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 20,
          hoverBackgroundColor: documentStyle.getPropertyValue('--primary-500') || '#cc3f96',
          hoverBorderColor: documentStyle.getPropertyValue('--primary-500') || '#cc3f96',
        },
      ],
    });
    this.chartOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
          },
          grid: {
            color: borderColor,
            display: false,
          },
        },
        y: {
          ticks: {
            color: textMutedColor,
          },
          grid: {
            color: borderColor,
          },
        },
      },
    });

  }

  changeLabelDate(event: any) {
    console.log("changeLabelDate", event);
    switch (event.value) {
      case 'semaine':
        this.labelDate = "Début de semaine";
        break;
      case 'mois':
        this.labelDate = "mois";
        break;
      case 'annee':
        this.labelDate = "annee";
        break;
      default:
        this.labelDate = "annee";
    }
    this.listeTypesDate.forEach(item => {
      if (item.value === event.value) {
        item.label = this.labelDate;
      } else {
        item.label = item.value;
      }
    });

  }
  changeLabelDateStats(event: any) {
    console.log("changeLabelDate", event);
    switch (event.value) {
      case 'semaine':
        this.labelDate = "Début de semaine";
        break;
      case 'mois':
        this.labelDate = "mois";
        break;
      case 'annee':
        this.labelDate = "annee";
        break;
      default:
        this.labelDate = "mois";
    }
    this.listeTypesDate.forEach(item => {
      if (item.value === event.value) {
        item.label = this.labelDate;
      } else {
        item.label = item.value;
      }
    });

  }
  loadTrajetsStatsOld() {
    this.TrajetStats = undefined; // Clear previous stats before loading new ones

    this.selectedType = 'mois';
    // this.selectedDate = new Date(Date.now()).toISOString().split('T')[0];
    // // Default to today's date in YYYY-MM format
    const formattedDate1 = new Date().toISOString().split('T')[0].slice(0, 7);
    this.selectedDate = formattedDate1;
    this.depart = 'Gafsa';
    this.destination = 'Metlaoui';
    console.warn('Please fill in all fields before loading statistics.', {
      depart: this.depart,
      destination: this.destination,
      selectedType: this.selectedType,
      selectedDate: this.selectedDate,
    });
    // if (!this.depart || !this.destination || !this.selectedType || this.selectedDate) {
    //   console.warn('Please fill in all fields before loading statistics.', {
    //     depart: this.depart,
    //     destination: this.destination,
    //     selectedType: this.selectedType,
    //     selectedDate: this.selectedDate,
    //   });
    //   return;
    // }

    let trajetsDate = new Date(this.selectedDate!);
    console.log("Selected Date:", trajetsDate);
    console.log("Selected Type:", this.selectedType);
    console.log("Depart:", this.depart);
    console.log("Destination:", this.destination);
    if (this.selectedType === 'mois') {
      trajetsDate.setDate(1); // Set to the first day of the month
    }
    const formattedDate =
      trajetsDate.getFullYear() + '-' +
      String(trajetsDate.getMonth() + 1).padStart(2, '0') + '-' +
      String(trajetsDate.getDate()).padStart(2, '0');

    console.log('formattedDate', formattedDate);
    const testadata =
    {
      "type": "mois",
      "date": "2026-05-01",
      "depart": "Gafsa",
      "destination": "Metlaoui"
    };
    //change this to await and use async pipe in html

    this.TableauBordService.getTrajetsStats(testadata).subscribe({
      next: (response) => {
        console.log('Trajets Stats:', response);
        this.TrajetStats = response;
        this.totalTrajets = response.totalTrajets;
        this.trajet_Depart_Destination = response.trajets_type_Date_depart_destination;
      },
      error: (error) => {
        console.error('Failed to fetch trajets stats:', error);
      },

      complete: () => {
        console.log('Trajets stats request completed.');
        this.showAdvancedStats = true;

      }

    });

  }


  // async loadTrajetsStats(): Promise<void> {
  //   this.TrajetStats = undefined;

  //   this.selectedType = 'mois';

  //   const formattedDate1 = new Date()
  //     .toISOString()
  //     .split('T')[0]
  //     .slice(0, 7);

  //   this.selectedDate = formattedDate1;
  //   this.depart = 'Gafsa';
  //   this.destination = 'Metlaoui';

  //   console.warn('Please fill in all fields before loading statistics.', {
  //     depart: this.depart,
  //     destination: this.destination,
  //     selectedType: this.selectedType,
  //     selectedDate: this.selectedDate,
  //   });

  //   try {
  //     let trajetsDate = new Date(this.selectedDate!);

  //     console.log('Selected Date:', trajetsDate);
  //     console.log('Selected Type:', this.selectedType);
  //     console.log('Depart:', this.depart);
  //     console.log('Destination:', this.destination);

  //     if (this.selectedType === 'mois') {
  //       trajetsDate.setDate(1);
  //     }

  //     const formattedDate =
  //       trajetsDate.getFullYear() +
  //       '-' +
  //       String(trajetsDate.getMonth() + 1).padStart(2, '0') +
  //       '-' +
  //       String(trajetsDate.getDate()).padStart(2, '0');

  //     console.log('formattedDate', formattedDate);

  //     const testadata = {
  //       type: this.selectedType,
  //       date: formattedDate,
  //       depart: this.depart,
  //       destination: this.destination,
  //     };

  //     const response = await firstValueFrom(
  //       this.TableauBordService.getTrajetsStats(testadata)
  //     );

  //     console.log('Trajets Stats:', response);

  //     this.TrajetStats = response;
  //     this.totalTrajets = response.totalTrajets;
  //     this.trajet_Depart_Destination =
  //       response.trajets_type_Date_depart_destination;


  //     console.log('Trajets stats request completed.');
  //   } catch (error) {
  //     console.error('Failed to fetch trajets stats:', error);
  //   }
  // }


  loadTrajetsStats(): void {

    // let payload = {
    //   type: 'mois',
    //   date: new Date().toISOString().split('T')[0].slice(0, 7),
    //   depart: 'Gafsa',
    //   destination: 'Metlaoui'
    // };
    let payload = {
      type: this.selectedType || 'mois',
      date: this.selectedDate || new Date().toISOString().split('T')[0].slice(0, 7),
      depart: this.depart || 'Gafsa',
      destination: this.destination || 'Metlaoui'
    };
    console.log(payload);

    this.trajetsStats$ =
      this.TableauBordService.getTrajetsStats(payload);
  }
  async afficherStatistiqueAvancee() {
    await this.loadTrajetsStats();
    console.log('Affichage de la statistique avancée', {
      totalTrajets: this.totalTrajets,
      trajet_Depart_Destination: this.trajet_Depart_Destination,
    });
    this.showAdvancedStats = true;

    // Logic to display advanced statistics
    // console.log('Affichage de la statistique avancée');
  }
}
