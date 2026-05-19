import { User } from '@/app/models/user.model';
import { AuthService } from '@/app/pages/service/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            <!-- {{item['roles']}} -->
            @if (!item.separator) {
                <!-- @if(item['roles'].includes(this.currentUser?.role)) { -->
                    <li app-menuitem [item]="item" [root]="true"></li>
                <!-- } -->
                <!-- <li app-menuitem [item]="item" [root]="true"></li> -->
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `,
})
export class AppMenu {
    model: MenuItem[] = [];
    private authService = inject(AuthService)
    currentUser: User | undefined;

    ngOnInit() {
        this.currentUser = this.authService.getCurrentUser();

        this.model = [
            {
                label: 'Gestion de consommations des bus',
                items: [
                    { label: 'Tableauboard', icon: 'pi pi-fw pi-home', routerLink: ['/pages/tableau-bord'], roles: ['Directeur', 'Responsable', 'Agent'] },
                    { label: 'Gestion de bus', icon: 'pi pi-fw pi-car', routerLink: ['/pages/gestion_bus'], roles: ['Directeur', 'Responsable'] },
                    { label: 'Gestion de consommations', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/pages/gestion_consommation'], roles: ['Directeur', 'Agent'] },
                    { label: 'Gestion de trajets', icon: 'pi pi-fw pi-map-marker', routerLink: ['/pages/gestion_trajet'], roles: ['Directeur', 'Agent'] },
                    { label: 'Gestion de chauffeurs', icon: 'pi pi-fw pi-users', routerLink: ['/pages/gestion_chauffeur'], roles: ['Directeur', 'Responsable'] },
                    { label: 'Chats', icon: 'pi pi-fw pi-comments', routerLink: ['/pages/chats'], roles: ['Directeur', 'Responsable', 'Agent'] },
                ]
            },
        ];
    }
}
