// import { environment } from '@/environments/environment.development';
// import { HttpClient } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// @Injectable({
//     providedIn: 'root',
// })
// export class ChatsService {
//     private apiUrl = environment.apiUrl;
//     private http = inject(HttpClient);

//     createSession(): Observable<any> {
//         return this.http.post<any>(`${this.apiUrl}/chats/session`, {});
//     }

//     getRecentSessions(): Observable<any[]> {
//         return this.http.get<any[]>(`${this.apiUrl}/chats/sessions`);
//     }

//     getSessionMessages(sessionId: number): Observable<any[]> {
//         return this.http.get<any[]>(`${this.apiUrl}/chats/session/${sessionId}/messages`);
//     }

//     sendMessage(sessionId: number, message: string): Observable<any> {
//         return this.http.post<any>(`${this.apiUrl}/chats/message/${sessionId}`, { message });
//     }
// }
import { environment } from '@/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChatsService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    createSession(): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/chats/session`, {});
    }

    getRecentSessions(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/chats/sessions`);
    }

    getSessionMessages(sessionId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/chats/session/${sessionId}/messages`);
    }

    sendMessage(sessionId: number, message: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/chats/message/${sessionId}`, { message }).pipe(
            timeout(90000), // 90 seconds — give Ollama enough time to respond
            catchError((err) => {
                if (err.name === 'TimeoutError') {
                    return throwError(() => new Error('La réponse du serveur a pris trop de temps. Veuillez réessayer.'));
                }
                return throwError(() => err);
            })
        );
    }

    getTrajets(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/trajet/all`).pipe(
            timeout(90000),
            catchError((err) => throwError(() => err))
        );
    }
}