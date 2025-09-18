import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  showMenu = false;

  constructor(private router: Router, private location: Location) {}

  menuDisplay() {
    this.showMenu = !this.showMenu;
  }
  toggleHome() {
    this.router.navigate(['/']);
    this.menuDisplay();
  }
  toggleProjects() {
    this.router.navigate(['/projects']);
    this.menuDisplay();
  }
  toggleNews() {
    this.router.navigate(['/news']);
    this.menuDisplay();
  }
  toggleEvents() {
    this.router.navigate(['/events']);
    this.menuDisplay();
  }
  toggleAdvancedSearch() {
    this.router.navigate(['/advanced-search']);
    this.menuDisplay();
  }
  toggleAbout() {
    this.router.navigate(['/about']);
    this.menuDisplay();
  }
}
