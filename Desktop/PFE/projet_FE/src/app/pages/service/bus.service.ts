//Bus service to handle bus related logic
import { Bus } from '@/app/models/bus.model';
import { TypeConsommation } from '@/app/models/consommation.model';
import { environment } from '@/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class BusService {
    getBusConsommation(type: TypeConsommation | undefined, date: Date | undefined) {
        throw new Error('Method not implemented.');
    }
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getAllBus(): Observable<Bus[]> {
        return this.http.get<Bus[]>(`${this.apiUrl}/bus/all`);
    }
    createBus(bus: Bus): Observable<Bus> {
        return this.http.post<Bus>(`${this.apiUrl}/bus`, bus);
    }

    //get bus by id   
    getBusById(id: number): Observable<Bus> {
        return this.http.get<Bus>(`${this.apiUrl}/bus/${id}`);
    }
    // 
    getAllbyTypeConso_Date(type: string, date: string): Observable<Bus[]> {
        // const formattedDate = date.toDateString(); // Formatage de la date en string
        // console.log("formattedDate", formattedDate);

        return this.http.get<Bus[]>(`${this.apiUrl}/bus/typeDate/type/${type}/date/${date}`);
    }
    //update bus
    updateBus(id: number, bus: Bus): Observable<Bus> {
        return this.http.patch<Bus>(`${this.apiUrl}/bus/${id}`, bus);
    }
    //delete bus
    removeBus(id: number, bus: Bus) {
        return this.http.delete(`${this.apiUrl}/bus/${id}`)
    }
}