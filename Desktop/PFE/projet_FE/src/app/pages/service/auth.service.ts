//create auth service to handle authentication logic
import { User } from '@/app/models/user.model';
import { environment } from '@/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);
    private router = inject(Router);

    //signin method to handle login logic
    signIn(matricule: string, password: string) {
        //login logic here
        console.log('Matricule:', matricule);
        console.log('Password:', password);
        //return true if login is successful, false otherwise
        this.http.post(`${this.apiUrl}/auth/signin`, { matricule, password }).subscribe({
            next: (response) => {
                console.log('Login successful:', response);

                //store token in local storage
                localStorage.setItem('user', JSON.stringify(response)); //placeholder, replace with actual token', response);
                //navigate to home page
                this.router.navigate(['/']);
            },
            error: (error) => {
                console.error('Login failed:', error);
                //show error message to user
            }
        });

        return false; //placeholder return value, replace with actual login logic
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) as User : undefined;
    }

    logout() {
        console.log("Logouting ..");
        return this.http.get(`${this.apiUrl}/auth/logout`);
    }

    isAuthenticated(): Observable<boolean> {
        // Call the backend to verify if the user is authenticated
        return this.http.get<{ isAuthenticated: boolean }>(`${this.apiUrl}/auth/verify-token`).pipe(
            tap(response => {
                // Log the entire response for debugging
                console.log('Auth Verification Response:', response);
            }),
            map(response => response.isAuthenticated),
            catchError(() => of(false))
        );
    }
}