import { LayoutService } from '@/app/layout/service/layout.service';
import { User } from '@/app/models/user.model';
import { AuthService } from '@/app/pages/service/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';


@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo  flex align-items-center gap-2" routerLink="/">
                   <img src="https://cdn-icons-png.flaticon.com/512/5030/5030991.png" height="40" alt="" style="width:50px; height:auto;"/>
                
                <span>Gestion de consommation Bus</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <!-- <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button> -->
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                   <!-- <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>
                    <button type="button" class="layout-topbar-action" >
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>-->
                    <div class="flex align-center">
                <h4>{{currentUser?.name}} : </h4>
                    <h5 style="color:var(--primary-color)">{{currentUser?.role}} </h5>
                    <!-- <h4>{{currentUser?.matricule}}</h4> -->
                    <button type="button" class="layout-topbar-action" (click)="logoutAction()">
                        <i class="pi pi-power-off"></i>
                        <span>Logout</span>
                    </button>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar implements OnInit {
    items!: MenuItem[];


    layoutService = inject(LayoutService);
    router = inject(Router);
    authService = inject(AuthService);

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }
    currentUser: User | undefined;



    ngOnInit() {
        //read local storage
        const user = localStorage.getItem('user');
        console.log("user:", user);

        if (user) {
            this.currentUser = JSON.parse(user);
        }
    }
    logoutAction() {
        // navigate to auth/login using router
        this.authService.logout().subscribe((data) =>
            console.log(data)
        );
        this.router.navigate(['/auth/login']);
    }
}
