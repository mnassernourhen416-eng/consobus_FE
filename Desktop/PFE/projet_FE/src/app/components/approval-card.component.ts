import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EtatBus } from '../models/bus.model';

@Component({
  selector: 'app-approval-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="approval-card mr-1 mb-1" (click)="onClick()">
      <!-- Background watermark checkmark -->
      <div class="watermark-check">
        <!-- <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 52 L38 75 L85 25"
            stroke="#F5E6B0"
            stroke-width="18"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg> -->
        <img src="https://cdn-icons-png.flaticon.com/512/5030/5030991.png" alt="">
      </div>

      <!-- Card content -->
      <div class="card-content">
        <div class="count">{{ matricule }}</div>
        <div class="divider"></div>
        <div class="label">{{ nomChauffeur }}</div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .approval-card {
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
        background: #fff241;
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
