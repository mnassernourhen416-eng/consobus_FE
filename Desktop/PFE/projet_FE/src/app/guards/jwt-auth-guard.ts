import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../pages/service/auth.service';

@Injectable({
    providedIn: 'root',
})
export class JwtGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    async canActivate(): Promise<boolean> {
        console.log("in canActivate !!");
        const isAuthenticated = await firstValueFrom(this.authService.isAuthenticated());
        if (isAuthenticated) {
            return true
        }
        else {
            this.router.navigate(['/auth/login']);
            return false;
        }

        // if (this.authService.isAuthenticated()) {
        //   return true;
        // } else {
        //   // Navigate to login or another page
        //   this.router.navigate(['/login']);
        //   return false;
        // }
    }
}