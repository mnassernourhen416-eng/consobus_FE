import { environment } from '@/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class StatsService {
    private apiUrl = environment.apiUrl
    private http = inject(HttpClient)
    // getStats(): Observable<any> {
    //     return this.http.get(`${this.apiUrl}/stats/${type}`);
    // }
}