import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-opportunities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opportunities.component.html',
  styleUrl: './opportunities.component.scss'
})
export class OpportunitiesComponent {
  email = "contact@sparkcapital.com";
  content = "Hello, After reviewing your company and your recent progress, we were very impressed by your achievements and your vision for the future. We believe your solution addresses a significant and growing need in the market. We would like to explore a potential investment partnership with your team. Depending on your funding requirements, we are prepared to discuss an initial investment of up to €500,000 to €1M";
  email2 = "bonjour@horizonfund.fr";
  content2 = "We have been following your company and are impressed by your progress in sustainable tech. We are interested in discussing a possible partnership and a direct investment to help you accelerate your expansion plans. Would you be available for a quick call next week?";
}
