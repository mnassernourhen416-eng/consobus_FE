// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from '../pages/service/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class RoleGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
//     const expectedRoles = next.data['expectedRoles'];
//     const user = this.authService.getCurrentUser();

//     if (user && expectedRoles.includes(user.role)) {
//       return true;
//     }

//     // Redirect to unauthorized page or home page
//     this.router.navigate(['/auth/denied']);
//     return false;
//   }
// }