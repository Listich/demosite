import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, inject, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ScrollerModule } from 'primeng/scroller';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface Investor {
  id?: string;
  name: string;
  country: string;
  email?: string;
  phone?: string;
  investment_focus?: string;
}

interface Startup {
  name: string;
}

interface ApiStartup {
  id?: string;
  name: string;
  legal_status: string;
  address: string;
  email: string;
  phone: string;
  sector: string;
  maturity: string;
}

interface ApiProject {
  id?: string;
  name: string;
  description: string;
  founders: string;
  contacts: string;
  progress: string;
  needs: string;
  links: string;
  sector: string;
  created_at?: string;
}

@Component({
  selector: 'app-startups',
  standalone: true,
  imports: [CommonModule, ChartModule, ScrollerModule, ToastModule],
  templateUrl: './startups.component.html',
  styleUrls: ['./startups.component.scss'],
  providers: [MessageService]
})
export class StartupsComponent implements OnInit {
  dataDonut: any;
  optionsDonut: any;

  dataBar: any;
  optionsBar: any;

  investors: Investor[] = [];
  startups: Startup[] = [];
  projects: ApiProject[] = [];

  totalProjects = 0;
  totalStartups = 0;

  loading = true;
  platformId = inject(PLATFORM_ID);

  constructor(
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    } else {
      this.initWithDefaultData();
      this.loading = false;
    }
  }

  async loadData() {
    this.loading = true;
    this.loadProjects()
      .then(() => this.loadStartups())
      .then(() => this.loadInvestors())
      .then(() => {
        this.initChart();
        this.loading = false;
        this.cd.markForCheck();
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des données', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les données'
        });
      });
  }

  initWithDefaultData() {
    this.initInvestors();
    this.initStartups();
    this.totalProjects = 5;
    this.totalStartups = this.startups.length;
    this.initChart();
  }

  async loadStartups(): Promise<void> {
    return new Promise((resolve) => {
      if (!isPlatformBrowser(this.platformId)) {
        resolve();
        return;
      }

      const token = localStorage.getItem('api_token') || '';
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

      this.http
        .get<ApiStartup[]>('http://127.0.0.1:8000/api/startups', { headers })
        .subscribe({
          next: (data) => {
            this.startups = data;
            this.totalStartups = data.length;
            resolve();
          },
          error: (err) => {
            console.error('Erreur startups', err);
            this.initStartups();
            this.totalStartups = this.startups.length;
            resolve();
          }
        });
    });
  }

  async loadProjects(): Promise<void> {
    return new Promise((resolve) => {
      if (!isPlatformBrowser(this.platformId)) {
        resolve();
        return;
      }

      const token = localStorage.getItem('api_token') || '';
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

      this.http
        .get<ApiProject[]>('http://127.0.0.1:8000/api/projects', { headers })
        .subscribe({
          next: (data) => {
            this.projects = data;
            this.totalProjects = data.length;
            resolve();
          },
          error: (err) => {
            console.error('Erreur projets', err);
            this.totalProjects = 5;
            resolve();
          }
        });
    });
  }

  async loadInvestors(): Promise<void> {
    return new Promise((resolve) => {
      if (!isPlatformBrowser(this.platformId)) {
        this.initInvestors();
        resolve();
        return;
      }

      const token = localStorage.getItem('api_token') || '';
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

      this.http
        .get<Investor[]>('http://127.0.0.1:8000/api/investors', { headers })
        .subscribe({
          next: (data) => {
            this.investors = data;
            resolve();
          },
          error: (err) => {
            console.error('Erreur investisseurs', err);
            this.initInvestors();
            resolve();
          }
        });
    });
  }

  initInvestors() {
    this.investors = [
      { name: 'Sequoia Capital', country: 'USA' },
      { name: 'Accel Partners', country: 'UK' },
      { name: 'Kima Ventures', country: 'France' },
      { name: 'SoftBank Vision Fund', country: 'Japan' },
      { name: 'Index Ventures', country: 'Switzerland' }
    ];
  }

  initStartups() {
    this.startups = [
      { name: 'Startup A' },
      { name: 'Startup B' },
      { name: 'Startup C' }
    ];
  }

  initChart() {
    const palette = [
      '#F18585', '#F49C9C', '#F6AEAE', '#F8CACF',
      '#EED5FB', '#E4BEF8', '#D5A8F2', '#CB90F1', '#C174F2'
    ];

    // Donut chart - Répartition par secteur
    const sectorCounts: { [key: string]: number } = {};
    this.projects.forEach((p) => {
      if (p.sector) {
        sectorCounts[p.sector] = (sectorCounts[p.sector] || 0) + 1;
      }
    });

    this.dataDonut = {
      labels: Object.keys(sectorCounts),
      datasets: [
        {
          data: Object.values(sectorCounts),
          backgroundColor: palette,
          hoverBackgroundColor: palette.map((c) => this.adjustColor(c, -20)),
          borderWidth: 0
        }
      ]
    };

    this.optionsDonut = {
      cutout: '70%',
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#374151', font: { size: 14 } }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };

    const monthlyCounts = this.calculateMonthlyProjectCounts();
    
    this.dataBar = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Projects created',
          backgroundColor: '#CB90F1',
          borderColor: '#CB90F1',
          data: monthlyCounts
        }
      ]
    };

    this.optionsBar = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltip: { mode: 'index', intersect: false },
        legend: { 
          labels: { color: '#374151', font: { size: 14 } },
          display: true
        }
      },
      scales: {
        x: {
          ticks: { color: '#6b7280' },
          grid: { color: '#e5e7eb', drawBorder: false }
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#6b7280' },
          grid: { color: '#e5e7eb', drawBorder: false }
        }
      }
    };
  }

  private calculateMonthlyProjectCounts(): number[] {
    const monthlyCounts = new Array(12).fill(0);
    
    if (this.projects.length > 0 && this.projects[0].created_at) {
      this.projects.forEach(project => {
        if (project.created_at) {
          const date = new Date(project.created_at);
          const month = date.getMonth();
          monthlyCounts[month]++;
        }
      });
    } else {
      for (let i = 0; i < 12; i++) {
        monthlyCounts[i] = Math.floor(Math.random() * 10) + 2;
      }
    }
    
    return monthlyCounts;
  }

  private adjustColor(hex: string, amount: number): string {
    let usePound = false;
    if (hex[0] === '#') {
      hex = hex.slice(1);
      usePound = true;
    }
    const num = parseInt(hex, 16);
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00ff) + amount;
    let b = (num & 0x0000ff) + amount;
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return (usePound ? '#' : '') + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }
}