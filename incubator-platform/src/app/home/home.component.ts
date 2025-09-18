import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, Subscription } from 'rxjs';

export interface Stats {
  totalProjects: number;
  totalInvestors: number;
  activeProjects: number;
  completedProjects: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  showMenu = false;
  stats: Stats = {
    totalProjects: 42,
    totalInvestors: 27,
    activeProjects: 35,
    completedProjects: 7
  };
  
  private refreshSubscription!: Subscription;
  private statsLoaded = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadStats(); // Chargement initial
    // Mise à jour automatique toutes les 30 secondes
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadStats();
    });
  }

  ngAfterViewInit() {
    // Animation pour les statistiques après le chargement initial
    if (this.statsLoaded) {
      this.animateStats();
    }
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private getHeaders(): { [header: string]: string } {
    const token = localStorage.getItem('api_token') || '';
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  loadStats() {
    this.http.get<Stats>('http://127.0.0.1:8000/api/stats', {
      headers: this.getHeaders()
    }).subscribe({
      next: (data) => {
        this.stats = data;
        this.statsLoaded = true;
        
        // Mettre à jour les éléments DOM avec les nouvelles valeurs
        this.updateStatDisplays();
        
        // Relancer l'animation après la mise à jour des données
        if (this.statsLoaded) {
          setTimeout(() => this.animateStats(), 100);
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques', err);
        // Utiliser les valeurs par défaut et quand même animer
        this.statsLoaded = true;
        setTimeout(() => this.animateStats(), 100);
      }
    });
  }

  updateStatDisplays() {
    // Mettre à jour les éléments DOM avec les nouvelles valeurs
    const statElements = document.querySelectorAll('.stat-number');
    
    statElements.forEach(element => {
      const statElement = element as HTMLElement;
      const statType = statElement.getAttribute('data-stat');
      
      if (statType) {
        const value = this.stats[statType as keyof Stats] || 0;
        statElement.setAttribute('data-count', value.toString());
        statElement.textContent = value.toString();
      }
    });
  }

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

  animateStats() {
    const statElements = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const targetValue = parseInt(target.getAttribute('data-count') || '0');
          this.countUp(target, targetValue);
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    statElements.forEach(stat => {
      // Réinitialiser l'animation pour les éléments déjà observés
      const currentValue = parseInt(stat.getAttribute('data-count') || '0');
      (stat as HTMLElement).textContent = '0';
      observer.observe(stat);
    });
  }

  countUp(element: HTMLElement, target: number) {
    // Arrêter toute animation en cours
    if (element.getAttribute('data-animating') === 'true') {
      return;
    }
    
    element.setAttribute('data-animating', 'true');
    
    const duration = 2000; // ms
    const frameRate = 1000 / 60; // ~60fps
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;
    
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4); // Courbe d'animation easing
      const currentValue = Math.round(target * easeOutQuart);
      
      element.textContent = currentValue.toString();
      
      if (frame === totalFrames) {
        element.textContent = target.toString(); // Valeur finale exacte
        element.setAttribute('data-animating', 'false');
        clearInterval(counter);
      }
    }, frameRate);
  }

  // Méthodes d'accès pratiques pour le template
  get totalProjects(): number {
    return this.stats.totalProjects;
  }

  get totalInvestors(): number {
    return this.stats.totalInvestors;
  }

  get activeProjects(): number {
    return this.stats.activeProjects;
  }

  get completedProjects(): number {
    return this.stats.completedProjects;
  }
}
