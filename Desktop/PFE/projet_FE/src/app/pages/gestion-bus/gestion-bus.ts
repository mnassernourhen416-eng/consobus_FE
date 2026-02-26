import { Component, inject } from '@angular/core';
import { BusService } from '../service/bus.service';

@Component({
  selector: 'app-gestion-bus',
  imports: [],
  templateUrl: './gestion-bus.html',
  styleUrl: './gestion-bus.scss',
})
export class GestionBus {
  private busService = inject(BusService);

  ngOnInit() {
    this.busService.getAllBus().subscribe({
      next: (response) => {
        console.log('All Bus:', response);
      },
      error: (error) => {
        console.error('Failed to fetch buses:', error);
      }
    });
  }

}
