import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { MenuComponent } from '../menu/menu.component';
import { MenuStartupsComponent } from '../menu-startups/menu-startups.component';

@Component({
  selector: 'app-startups-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoginComponent, MenuComponent, MenuStartupsComponent],
  templateUrl: './startups-layout.component.html',
  styleUrl: './startups-layout.component.scss'
})
export class StartupsLayoutComponent {

}
