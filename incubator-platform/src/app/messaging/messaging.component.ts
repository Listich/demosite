import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.scss'
})
export class MessagingComponent {
  company = "Chat with Capital Roots";
  message = "Hello, I'm Isabelle currently in charge of your folder here at Capital Roots. The administration team is currently busy due to a high volume of requests, the result of your funding application will be communicated to you by the end of the week. We appreciate your patience and understanding.";
  company2 = "Chat with Urban Seed";
  message2 = "Hello, this is Sarah from Urban Seed. How is the funding process going? We are very interested in your project and would like to discuss potential investment opportunities. Please let us know when you are available for a meeting.";
}
