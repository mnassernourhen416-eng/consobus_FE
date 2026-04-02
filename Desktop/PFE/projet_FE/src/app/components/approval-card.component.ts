import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { EtatBus } from '../models/bus.model';

@Component({
  selector: 'app-approval-card',
  standalone: true,
  imports: [CommonModule, TooltipModule, AvatarModule, ButtonModule, BadgeModule],
  template: `
  <div class="app-approval-card">
    <div class="approval-card mr-1 mb-1" (click)="onClick()">
      <!-- Background watermark checkmark -->
      <div class="watermark-check">
        
        <img src="https://cdn-icons-png.flaticon.com/512/5030/5030991.png" alt="">
      </div>
      <!--avatar chauffeur
      <p-avatar  size="large" class= "avatar" shape="circle">
        <img src="https://www.flaticon.com/fr/icone-gratuite/chauffeur_904718.png" alt="chauffeur">
      </p-avatar>-->

      <!-- Card content -->
       
      <div class="card-content">
        <div class="count">{{ matricule }}</div>
        <div class="divider"></div>
        <div class="label">{{ nomChauffeur }}</div>
      </div>
      <!-- badge etat -->
      <!--<p-badge 
        [value]="etatBus"
        [severity]="etatBus === 'Disponible' ? 'success' : 'danger'">
      </p-badge>
      <button pButton type="button" label="Mission" 
       icon="pi pi-send" class="p-button-sm mission-btn"></button>-->
       <!--icone info-->
      <i class="pi pi-info-circle text-red-500 icon-alert" [pTooltip]="tooltipBus" tooltipPosition="right"
      style="cursor:pointer; font-size:18px">
      </i>
       
    </div>
   
  



<ng-template #tooltipBus>

  <div class="tooltip-bus">

    <b>Informations Bus</b>

    <table>
      <tr>
        <td>Matricule</td>
        <td>{{matricule}}</td>
      </tr>

      <tr>
        <td>Chauffeur</td>
        <td>{{nomChauffeur}}</td>
      </tr>

      <tr>
        <td>Etat</td>
        <td>{{etatBus}}</td>
      </tr>

    </table>

  </div>

</ng-template>
  `,
  styles: [`
  .app-approval-card{
    display: flex;
    flex-direction:row-reverse;
  }
    :host {
      display: block;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .approval-card {
      display: grid;
      
      margin-top: 20px;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 20px;
      position: relative;
      width: 150px;
      height: 150px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      padding: 16px;
      box-sizing: border-box;
      cursor: pointer;
      :hover {
        background: #c5be3d;
        transform:translateY(-6px);
        box-shadow:0 8px 25px rgba(0,0,0,0.15);
      }
    }

    .watermark-check {
      position: absolute;
      top: -10px;
      left: 10px;
      width: 100px;
      height: 100px;
      opacity: 0.5;
      pointer-events: none;

    }

    .watermark-check svg {
      width: 100%;
      height: 100%;
    }

    .card-content {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      z-index: 1;
    }

    .count {
      font-size: 24px;
      font-weight: 700;
      color: #D4A017;
      line-height: 1;
      letter-spacing: -1px;
    }

    .divider {
      width: 60px;
      height: 2px;
      background: #D4A017;
      border-radius: 1px;
    }

    .label {
      font-size: 10px;
      color: #C8940A;
      font-weight: 500;
      text-align: right;
      white-space: nowrap;
    }

  
    .tooltip-bus { background: #5b4e8a;
         padding: 10px;
          border-radius: 10px;
          font-size: 10px; 
        } //tooltip
    .icon-alert {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 20px;
      color: #d80f0f;
      cursor: pointer;
    }  
  /*  .avatar{
      margin-bottom: 4px;
    } 
    .mission-btn{
      margin-top: 4px;
    }*/
  `]
})
export class ApprovalCardComponent {
  @Input() matricule: string = "0";
  @Input() nomChauffeur: string = 'مراسلات للمصادقة';
  @Input() etatBus: EtatBus = EtatBus.Disponible
  //action when clicked
  onClick() {
    console.log("clicked", this.matricule, this.nomChauffeur);
  }

}
