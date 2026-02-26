//create auth service to handle authentication logic
import { environment } from '@/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';


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
                // localStorage.setItem('token', response.token);
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
}