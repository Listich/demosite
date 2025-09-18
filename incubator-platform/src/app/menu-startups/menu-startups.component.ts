import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-menu-startups',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './menu-startups.component.html',
  styleUrl: './menu-startups.component.scss'
})
export class MenuStartupsComponent {
  showMenu = false;

  constructor(private router: Router, private location: Location) {}

  menuDisplay() {
    this.showMenu = !this.showMenu;
  }
  toggleDashboard() {
    this.router.navigate(['/startups']);
    this.menuDisplay();
  }
  toggleManage() {
    this.router.navigate(['/startups/manage']);
    this.menuDisplay();
  }
  toggleProfile() {
    this.router.navigate(['/startups/my-profile']);
    this.menuDisplay();
  }
  toggleMessaging() {
    this.router.navigate(['/startups/messaging']);
    this.menuDisplay();
  }
  toggleOpportunities() {
    this.router.navigate(['/startups/opportunities']);
    this.menuDisplay();
  }
  toggleAdmin() {
    this.router.navigate(['/startups/Admin']);
    this.menuDisplay();
  }
}
