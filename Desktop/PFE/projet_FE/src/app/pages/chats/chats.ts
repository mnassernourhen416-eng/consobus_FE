// import { Component, inject } from '@angular/core';
// import { Scroller } from "primeng/scroller";
// import { StyleClass } from "primeng/styleclass";
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import {ChatsService} from '../service/chats.service';
// import { ButtonModule } from 'primeng/button';
// import { InputTextModule } from 'primeng/inputtext';
// import { Message } from 'primeng/api';
// import {ScrollPanelModule } from 'primeng/scrollpanel';

// @Component({
//   selector: 'app-chats',
//   imports: [Scroller, StyleClass, CommonModule, FormsModule, ButtonModule, InputTextModule, ChatsService, Message, ScrollPanelModule],
//   templateUrl: './chats.html',
//   styleUrl: './chats.scss',
// })
// export class Chats {
//   chatsService = inject(ChatsService);
//   UserMessage: string = ''
//   sendMessage() {
//     if (this.UserMessage.trim() !== '') {
//       this.chatsService.sendMessage(this.UserMessage);
//       this.UserMessage = '';
//     }

// }
