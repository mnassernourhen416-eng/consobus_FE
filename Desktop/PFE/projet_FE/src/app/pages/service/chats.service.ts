// import { Injectable, Signal } from "@angular/core";
// import { HttpClient } from "@angular/common/http";
// import { environment } from "@/environments/environment.development";
// import { inject } from "@angular/core";
// import { Observable } from "rxjs";
// import { firstValueFrom } from "rxjs";

// interface Message {
//   content: string;
//   sender: 'user' | 'assistant';
// }
// @Injectable({
//   providedIn: 'root'
// })
// export class ChatsService {
//     private apiUrl = environment.apiUrl
//     private http = inject(HttpClient);

//     sessionId:Signal<string | null> = () => null;
//     messages: Signal<Message[]> = () => [];
//     loading: Signal<boolean> = () => false;

//     async startNewSession() {
//         const response = await firstValueFrom(this.http.post<{ id: string }>(`${this.apiUrl}/chats/session`, {}));
//         this.sessionId.set(response.id);
//         this.messages.set([]);
//     }
//     async sendMessage(content: string) {
//         if (!this.sessionId()) {
//             await this.startNewSession();
//         }
//         this.loading.set(true);
//         this.messages.set([...prev, {role: 'user', content }]);
//         try {
//             const res = await firstValueFrom(this.http.post<{ content: string }>(`${this.apiUrl}/chats/message`, { sessionId: this.sessionId(), content }));
//             this.messages.update((prev) => [...prev, {role: 'assistant', content: response.content }]);
//         } catch (error) {
//             console.error('Error sending message:', error);
//         } finally {
//             this.loading.set(false);

//         }
//     }

//   constructor() { }
// }