//trajet service to handle trajet related logic

import { Chauffeur } from '@/app/models/chauffeur.model';
import { environment } from '@/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class ChauffeurService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getAllChauffeur(): Observable<Chauffeur[]> {
        return this.http.get<Chauffeur[]>(`${this.apiUrl}/chauffeur/all`);
    }
    createChauffeur(chauffeur: Chauffeur): Observable<Chauffeur> {
        //change the type of chauffeur.age to number before sending the data
        const age = Number(chauffeur.age);
        chauffeur.age = age;
        console.log("chauffeur: ", chauffeur)
        return this.http.post<Chauffeur>(`${this.apiUrl}/chauffeur`, chauffeur);
    }

    //get chauffeur by id   
    getChauffeurById(id: number): Observable<Chauffeur> {
        return this.http.get<Chauffeur>(`${this.apiUrl}/chauffeur/${id}`);
    }
    //get trajet by bus/:id
    //getTrajetByBusValeur(busId: string): Observable<Trajet[]> {
    // return this.http.get<Trajet[]>(`${this.apiUrl}/trajet/bus/id=${busId}`);
    // }
    //update trajet
    updateChauffeur(id: number, chauffeur: Chauffeur): Observable<Chauffeur> {
        const age = Number(chauffeur.age);
        chauffeur.age = age;
        return this.http.patch<Chauffeur>(`${this.apiUrl}/chauffeur/${id}`, chauffeur);
    }
    //delete 
    removeChauffeur(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/chauffeur/${id}`);
    }
}

