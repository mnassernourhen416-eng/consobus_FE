//Bus service to handle bus related logic
import { environment } from '@/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class BusService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getAllBus() {
        return this.http.get(`${this.apiUrl}/bus/all`);
    }

    //get bus by id   
    getBusById(id: number) {
        return this.http.get(`${this.apiUrl}/bus/${id}`);
    }
}