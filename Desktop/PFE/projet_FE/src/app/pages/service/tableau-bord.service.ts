//tableau-bord service to handle tableau-bord related logic

import { ConsommationBus, DashboardStats, TrajetBus, TrajetStats } from '@/app/models/dashboardstats';
import { environment } from '@/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class TableauBordService {
    private apiUrl = environment.apiUrl
    private http = inject(HttpClient)
    constructor() { }

    getTableauBord(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.apiUrl}/tableaubord/stats`);
    }
    getConsommationLastMonth(): Observable<ConsommationBus[]> {
        return this.http.get<ConsommationBus[]>(`${this.apiUrl}/tableaubord/consommation`);
    }
    // getTrajetStats(type: 'jour' | 'semaine' | 'mois',
    //     date?: Date): Observable<any> {
    //     return this.http.get<any>(`${this.apiUrl}/tableaubord/trajet/count/${type}${date ? `?date=${date.toISOString()}` : ''}`);
    // }
    getTrajetsLastMonth(): Observable<TrajetBus[]> {
        return this.http.get<TrajetBus[]>(`${this.apiUrl}/tableaubord/trajets/last-month`);
    }
    getTrajetsStats(count: {
        type?: 'semaine' | 'mois' | 'annee',
        date?: string,
        depart?: string,
        destination?: string,
    }): Observable<TrajetStats> { //type: 'jour' | 'semaine' | 'mois', date?: Date): Observable<TrajetStats> {
        return this.http.post<TrajetStats>(`${this.apiUrl}/tableaubord/trajets/count`, { count });
    }

}