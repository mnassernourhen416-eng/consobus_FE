//consommation service to handle consommation related logic

import { Consommation } from '@/app/models/consommation.model';
import { environment } from '@/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class ConsommationService {
    // update(id: number, payload: { busId: number; valeur: number; type: TypeConsommation; date: Date; }): any {
    //    throw new Error('Method not implemented.');
    // }
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getAllConsommation(): Observable<Consommation[]> {
        return this.http.get<Consommation[]>(`${this.apiUrl}/consommation/all`);
    }
    createSimpleConsommation(consommation: Partial<Consommation>): Observable<Consommation> {
        return this.http.post<Consommation>(`${this.apiUrl}/consommation`, consommation);
    }
    createMultipleConsommation(consommations: Partial<Consommation>[]): Observable<Partial<Consommation[]>> {
        return this.http.post<Partial<Consommation[]>>(`${this.apiUrl}/consommation/multiple/upsert`, consommations);
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
    updateConsommation(idConsommation: number, consommation: Partial<Consommation>): Observable<Consommation> { // Partial< Consommation): Observable<Consommation> {
        return this.http.patch<Consommation>(`${this.apiUrl}/consommation/${idConsommation}`, consommation);
    }
    //delete consommation 
    removeConsommation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/consommation/${id}`);
    }
    getTopConsommation(): Observable<Consommation[]> {
        return this.http.get<Consommation[]>(`${this.apiUrl}/consommation/top-consommation`);
    }

}

