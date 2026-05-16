import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Bus } from '../models/bus.model';
import { Trajet } from '../models/trajet.model';

@Component({
  selector: 'app-bus-container',
  standalone: true,
  imports: [CommonModule, TooltipModule, AvatarModule, ButtonModule, BadgeModule],
  templateUrl: './bus-container.component.html',
  styleUrl: './bus-container.component.css',

})
export class BusContainerComponent {
  @Input() matricule: string = "0";
  @Input() nomChauffeur: string = 'مراسلات للمصادقة';
  // @Input() etatBus: EtatBus = EtatBus.Disponible
  @Input() bus!: Bus;
  @Input() trajet: Trajet[] = [];

  @Output() busClicked = new EventEmitter<Bus>();
  //action when clicked
  onClick() {
    console.log("clicked", this.matricule, this.nomChauffeur);
    this.busClicked.emit(this.bus);
  }

}
