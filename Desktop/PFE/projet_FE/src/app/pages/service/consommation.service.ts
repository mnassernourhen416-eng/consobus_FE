//consommation service to handle consommation related logic

import { Consommation } from '@/app/models/consommation.model';
import { environment } from '@/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class ConsommationService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getAllConsommation(): Observable<Consommation[]> {
        return this.http.get<Consommation[]>(`${this.apiUrl}/consommation/all`);
    }
    createConsommation(consommation: Consommation): Observable<Consommation> {
        return this.http.post<Consommation>(`${this.apiUrl}/consommation`, consommation);
    }

    //get consommation by id   
    getConsommationById(id: number) {
        return this.http.get(`${this.apiUrl}/consommation/${id}`);
    }
    //get consommation by busvaleur
    getConsommationByBusValeur(busId: string, valeur: string = '10'): Observable<Consommation[]> {
        return this.http.get<Consommation[]>(`${this.apiUrl}/consommation/busvaleur?busId=${busId}&valeur=${valeur}`);
    }
    //update consommation
    updateConsommation(id: number, consommation: Consommation): Observable<Consommation> {
        return this.http.patch<Consommation>(`${this.apiUrl}/consommation/${id}`, consommation);
    }
    //delete consommation 
    removeConsommation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/consommation/${id}`);
    }
}

