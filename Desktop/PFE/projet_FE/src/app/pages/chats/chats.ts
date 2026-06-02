// import { CommonModule } from '@angular/common';
// import { Component, inject, OnInit, ViewChild } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Button } from 'primeng/button';
// import { InputText } from 'primeng/inputtext';
// import { ScrollPanel } from 'primeng/scrollpanel';
// import { ChatsService } from '../service/chats.service';

// @Component({
//     selector: 'app-chats',
//     standalone: true,
//     imports: [CommonModule, FormsModule, Button, InputText, ScrollPanel],
//     templateUrl: './chats.html',
//     styleUrl: './chats.scss',
// })
// export class Chats implements OnInit {
//     @ViewChild('scrollPanel') scrollPanel!: ScrollPanel;

//     sessions: any[] = [];
//     activeSessionId: number | null = null;
//     messages: any[] = [];
//     userMessage: string = '';
//     loading: boolean = false;

//     private chatsService = inject(ChatsService);

//     ngOnInit() {
//         this.loadSessions();
//     }

//     loadSessions() {
//         this.chatsService.getRecentSessions().subscribe({
//             next: (data) => {
//                 this.sessions = data;
//                 if (this.sessions.length > 0) {
//                     const storedSessionId = localStorage.getItem('active_chat_session_id');
//                     const sessionToSelect = this.sessions.find(s => s.id === Number(storedSessionId)) || this.sessions[0];
//                     this.selectSession(sessionToSelect.id);
//                 } else {
//                     this.createNewSession();
//                 }
//             },
//             error: (err) => {
//                 console.error('Error loading sessions:', err);
//                 this.createNewSession();
//             }
//         });
//     }

//     selectSession(sessionId: number) {
//         this.activeSessionId = sessionId;
//         localStorage.setItem('active_chat_session_id', String(sessionId));
//         this.loading = true;
//         this.chatsService.getSessionMessages(sessionId).subscribe({
//             next: (msgs) => {
//                 this.messages = msgs;
//                 this.loading = false;
//                 this.scrollToBottom();
//             },
//             error: (err) => {
//                 console.error('Error loading session messages:', err);
//                 this.loading = false;
//             }
//         });
//     }

//     createNewSession() {
//         this.loading = true;
//         this.chatsService.createSession().subscribe({
//             next: (session: any) => {
//                 this.sessions.unshift(session);
//                 this.activeSessionId = session.id;
//                 localStorage.setItem('active_chat_session_id', String(session.id));
//                 this.messages = [];
//                 this.loading = false;
//                 this.scrollToBottom();
//             },
//             error: (err) => {
//                 console.error('Error creating session:', err);
//                 this.loading = false;
//             }
//         });
//     }

//     sendMessage() {
//         if (!this.userMessage.trim() || !this.activeSessionId || this.loading) {
//             return;
//         }

//         const msgContent = this.userMessage.trim();
//         this.userMessage = '';

//         // Add user message immediately
//         this.messages.push({
//             role: 'user',
//             content: msgContent,
//             createdAt: new Date()
//         });
//         this.scrollToBottom();

//         this.loading = true;

//         this.chatsService.sendMessage(this.activeSessionId, msgContent).subscribe({
//             next: (res: any) => {
//                 // Add assistant response
//                 this.messages.push({
//                     role: 'assistant',
//                     content: res.content,
//                     createdAt: res.createdAt
//                 });
//                 this.loading = false;
//                 this.scrollToBottom();
//             },
//             error: (err) => {
//                 console.error('Error sending message:', err);
//                 this.messages.push({
//                     role: 'assistant',
//                     content: 'Demande non disponible dans l’application',
//                     createdAt: new Date()
//                 });
//                 this.loading = false;
//                 this.scrollToBottom();
//             }
//         });
//     }

//     scrollToBottom() {
//         setTimeout(() => {
//             if (this.scrollPanel) {
//                 const el = this.scrollPanel.el.nativeElement.querySelector('.p-scrollpanel-content');
//                 if (el) {
//                     el.scrollTop = el.scrollHeight;
//                 }
//             }
//         }, 100);
//     }
// }
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ScrollPanel } from 'primeng/scrollpanel';
import { TableModule } from 'primeng/table';
import { ChatsService } from '../service/chats.service';

@Component({
    selector: 'app-chats',
    standalone: true,
    imports: [CommonModule, FormsModule, InputText, ScrollPanel, TableModule],
    templateUrl: './chats.html',
    styleUrl: './chats.scss',
})
export class Chats implements OnInit {
    @ViewChild('scrollPanel') scrollPanel!: ScrollPanel;

    sessions: any[] = [];
    activeSessionId: number | null = null;
    messages: any[] = [];
    userMessage: string = '';
    loading: boolean = false;
    trajets: any[] = [];
    showTrajetsTable = false;

    private chatsService = inject(ChatsService);

    ngOnInit() {
        this.loadSessions();
    }

    loadSessions() {
        this.chatsService.getRecentSessions().subscribe({
            next: (data) => {
                this.sessions = data;
                if (this.sessions.length > 0) {
                    const storedSessionId = localStorage.getItem('active_chat_session_id');
                    const sessionToSelect = this.sessions.find(s => s.id === Number(storedSessionId)) || this.sessions[0];
                    this.selectSession(sessionToSelect.id);
                } else {
                    this.createNewSession();
                }
            },
            error: (err) => {
                console.error('Error loading sessions:', err);
                this.createNewSession();
            }
        });
    }

    selectSession(sessionId: number) {
        this.activeSessionId = sessionId;
        localStorage.setItem('active_chat_session_id', String(sessionId));
        this.loading = true;
        this.chatsService.getSessionMessages(sessionId).subscribe({
            next: (msgs) => {
                this.messages = msgs;
                this.loading = false;
                this.scrollToBottom();
            },
            error: (err) => {
                console.error('Error loading session messages:', err);
                this.loading = false;
            }
        });
    }

    createNewSession() {
        this.loading = true;
        this.chatsService.createSession().subscribe({
            next: (session: any) => {
                this.sessions.unshift(session);
                this.activeSessionId = session.id;
                localStorage.setItem('active_chat_session_id', String(session.id));
                this.messages = [];
                this.loading = false;
                this.scrollToBottom();
            },
            error: (err) => {
                console.error('Error creating session:', err);
                this.loading = false;
            }
        });
    }

    sendMessage() {
        if (!this.userMessage.trim() || !this.activeSessionId || this.loading) {
            return;
        }

        const msgContent = this.userMessage.trim();
        this.userMessage = '';
        this.showTrajetsTable = false;

        const isTrajetRequest = /afficher.*liste.*trajet|liste.*trajet|trajets.*liste|affiche.*trajets|afficher.*trajets/i.test(msgContent.toLowerCase());
        if (isTrajetRequest) {
            this.messages.push({
                role: 'user',
                content: msgContent,
                createdAt: new Date()
            });
            this.loading = true;
            this.chatsService.getTrajets().subscribe({
                next: (data: any[]) => {
                    this.trajets = data || [];
                    // Build a single assistant message containing the full list
                    // Format as a preformatted block so line breaks are preserved
                    const lines: string[] = [];
                    lines.push('Liste des trajets');
                    lines.push('#\tMatricule\tDépart\tDestination\tKilométrage\tDate');
                    this.trajets.forEach((t, idx) => {
                        const matricule = t.bus?.matricule || 'N/A';
                        const depart = t.depart || '-';
                        const destination = t.destination || '-';
                        const km = (t.kilometrage !== undefined && t.kilometrage !== null) ? `${t.kilometrage}` : '-';
                        // format date if present
                        let dateStr = '-';
                        if (t.date) {
                            try {
                                const d = new Date(t.date);
                                const dd = String(d.getDate()).padStart(2, '0');
                                const mm = String(d.getMonth() + 1).padStart(2, '0');
                                const yy = d.getFullYear();
                                dateStr = `${dd}/${mm}/${yy}`;
                            } catch (e) {
                                dateStr = String(t.date);
                            }
                        }
                        // escape any HTML in fields to avoid injection
                        const esc = (s: any) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        lines.push(`${idx + 1}\t${esc(matricule)}\t${esc(depart)}\t${esc(destination)}\t${esc(km)} km\t${esc(dateStr)}`);
                    });

                    const preHtml = `<pre style="white-space:pre-wrap">${lines.join('\n')}</pre>`;
                    this.messages.push({
                        role: 'assistant',
                        content: preHtml,
                        createdAt: new Date()
                    });
                    this.showTrajetsTable = false;
                    this.loading = false;
                    this.scrollToBottom();
                },
                error: (err) => {
                    console.error('Error loading trajets:', err);
                    this.messages.push({
                        role: 'assistant',
                        content: 'Impossible de charger la liste des trajets pour le moment.',
                        createdAt: new Date()
                    });
                    this.loading = false;
                    this.scrollToBottom();
                }
            });
            return;
        }

        // Add user message immediately
        this.messages.push({
            role: 'user',
            content: msgContent,
            createdAt: new Date()
        });
        this.scrollToBottom();

        this.loading = true;

        this.chatsService.sendMessage(this.activeSessionId, msgContent).subscribe({
            next: (res: any) => {
                // Add assistant response
                this.messages.push({
                    role: 'assistant',
                    content: res.content,
                    createdAt: res.createdAt
                });
                this.loading = false;
                this.scrollToBottom();
            },
            error: (err) => {
                console.error('Error sending message:', err);
                this.messages.push({
                    role: 'assistant',
                    content: 'Demande non disponible dans l’application',
                    createdAt: new Date()
                });
                this.loading = false;
                this.scrollToBottom();
            }
        });
    }

    scrollToBottom() {
        setTimeout(() => {
            if (this.scrollPanel) {
                const el = this.scrollPanel.el.nativeElement.querySelector('.p-scrollpanel-content');
                if (el) {
                    el.scrollTop = el.scrollHeight;
                }
            }
        }, 100);
    }
}