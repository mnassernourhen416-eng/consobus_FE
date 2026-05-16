//trajet service to handle trajet related logic

import { Trajet, Ville } from '@/app/models/trajet.model';
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
    getTrajetParVille(ville: Ville): Observable<Trajet[]> {
        return this.http.get<Trajet[]>(`${this.apiUrl}/trajet/ville`);
    }
    createTrajet(trajet: Partial<Trajet>): Observable<Trajet> {
        return this.http.post<Trajet>(`${this.apiUrl}/trajet`, trajet);
    }
    createTrajetWithChauffeur(payload: { trajet: Partial<Trajet>, chauffeurId: number }): Observable<Trajet> {
        return this.http.post<Trajet>(`${this.apiUrl}/trajet/chauffeur`, payload);
    }

    //get trajet by id   
    getTrajetById(id: number) {
        return this.http.get(`${this.apiUrl}/trajet/${id}`);
    }
    getAvailableChauffeurs(query: string, date: string): Observable<Trajet[]> {
        return this.http.get<Trajet[]>(`${this.apiUrl}/trajet/available-chauffeurs?query=${query}&date=${date}`);
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

    terminerTrajet(payload: { busId: number, chauffeurId: number }): Observable<void> { // Update the method signaturebusId: number, chauffeurId: number): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/trajet/terminer`, payload);
    }
}

