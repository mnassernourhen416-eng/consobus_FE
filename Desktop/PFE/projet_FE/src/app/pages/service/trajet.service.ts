//trajet service to handle trajet related logic

import { Trajet } from '@/app/models/trajet.model';
import { environment } from '@/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class TrajetService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getAllTrajet(): Observable<Trajet[]> {
        return this.http.get<Trajet[]>(`${this.apiUrl}/trajet/all`);
    }
    createTrajet(trajet: Trajet): Observable<Trajet> {
        return this.http.post<Trajet>(`${this.apiUrl}/trajet`, trajet);
    }

    //get trajet by id   
    getTrajetById(id: number) {
        return this.http.get(`${this.apiUrl}/trajet/${id}`);
    }
    //get trajet by bus/:id
    getTrajetByBusValeur(busId: string): Observable<Trajet[]> {
        return this.http.get<Trajet[]>(`${this.apiUrl}/trajet/bus/id=${busId}`);
    }
    //update trajet
    updateTrajet(id: number, trajet: Trajet): Observable<Trajet> {
        return this.http.patch<Trajet>(`${this.apiUrl}/trajet/${id}`, trajet);
    }
    //delete
    removeTrajet(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/trajet/${id}`);
    }
}

