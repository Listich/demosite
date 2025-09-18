import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-menu-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.scss'
})
export class MenuAdminComponent {
  showMenu = false;

  constructor(private router: Router, private location: Location) {}

  menuDisplay() {
    this.showMenu = !this.showMenu;
  }
  toggleDashboard() {
    this.router.navigate(['/admin']);
    this.menuDisplay();
  }
  toggleUser() {
    this.router.navigate(['/admin/user']);
    this.menuDisplay();
  }
  togglestartup() {
    this.router.navigate(['/admin/startup']);
    this.menuDisplay();
  }
  toggleproject() {
    this.router.navigate(['/admin/projects']);
    this.menuDisplay();
  }
  toggleOpportunities() {
    this.router.navigate(['/admin/opportunities']);
    this.menuDisplay();
  }
}
