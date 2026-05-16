import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `,
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Gestion de consommations des bus',
                items: [
                    { label: 'Tableauboard', icon: 'pi pi-fw pi-home', routerLink: ['/pages/tableau-bord'] },
                    { label: 'Gestion de bus', icon: 'pi pi-fw pi-car', routerLink: ['/pages/gestion_bus'] },
                    { label: 'Gestion de consommations', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/pages/gestion_consommation'] },
                    { label: 'Gestion de trajets', icon: 'pi pi-fw pi-map-marker', routerLink: ['/pages/gestion_trajet'] },
                    { label: 'Gestion de chauffeurs', icon: 'pi pi-fw pi-users', routerLink: ['/pages/gestion_chauffeur'] },
                ]
            },
        ];
    }
}
