import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <button class="login-button" (click)="openLogin()">
      <i class="pi pi-user" style="font-size: 2.5rem"></i>
    </button>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {
  constructor(private router: Router) {}

  openLogin() {
    this.router.navigate(['/login']);
  }
}
