import { DashboardStats, TrajetStats } from '@/app/models/dashboardstats';
import { Ville } from '@/app/models/trajet.model';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from "primeng/chart";
import { SelectModule } from 'primeng/select';
import { TableauBordService } from '../../service/tableau-bord.service';
@Component({
  selector: 'app-tableau-bord',
  imports: [CardModule, ButtonModule, CommonModule, ChartModule, SelectModule, FormsModule],
  templateUrl: './tableau-bord.html',
  styleUrl: './tableau-bord.scss',
})
export class TableauBord {
  private TableauBordService = inject(TableauBordService);

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
  depart: string = '';
  destination: string = '';
  selectedType?: string;
  dateOptions: { label: string, value: string }[] = [];
  selectedDate?: string;
  showAdvancedStats: boolean = false;


  ngOnInit() {

    this.getStat();
    this.getConsommationLastMonth();
    this.getTrajetsLastMonth();
    this.getTrajetsStats();
  }
  getTrajetsStats() {

    this.TableauBordService.getTrajetsStats({
      type: this.selectedType as 'semaine' | 'mois' | 'annee',
      date: this.selectedDate,  // Pass the selected date here      
      depart: this.depart,
      destination: this.destination
    }).subscribe({
      next: (response) => {
        // const labels = response.map(item => item.trajets_type_Date_depart_destination);
        // const values = response.map(item => item.totalTrajets);
        console.log('Trajets Stats:', response);
        // this.initChart(labels, values);
        console.log('Trajets Stats:', response);

        this.TrajetStats = response;
        // Handle the response for last month's trajets
      },
      error: (error) => {
        console.error('Failed to fetch last month\'s trajets:', error);
      }
    })
  }

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
  loadTrajetsStats() {
    if (!this.depart || !this.destination || !this.selectedType || !this.selectedDate) {
      return;
    }
    {
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

      this.TableauBordService.getTrajetsStats({ type: this.selectedType as 'semaine' | 'mois' | 'annee', date: formattedDate, depart: this.depart, destination: this.destination }).subscribe({
        next: (response) => {
          console.log('Trajets Stats:', response);
          this.TrajetStats = response;


        },
        error: (error) => {
          console.error('Failed to fetch trajets stats:', error);
        }
      });
    }
  }
  afficherStatistiqueAvancee() {
    this.loadTrajetsStats();
    this.showAdvancedStats = true;
    // Logic to display advanced statistics
    console.log('Affichage de la statistique avancée');
  }
}
