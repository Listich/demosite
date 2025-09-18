import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, inject, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ScrollerModule } from 'primeng/scroller';
import { isPlatformBrowser } from '@angular/common';

interface Investor {
  name: string;
  country: string;
}

interface Admin {
  name: string;
  status: 'En cours' | 'Terminé';
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ChartModule, ScrollerModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  dataDonut: any;
  optionsDonut: any;

  dataBar: any;
  optionsBar: any;

  investors: Investor[] = [];
  startups: Admin[] = [];

  totalProjects = 0;
  ongoingProjects = 0;

  platformId = inject(PLATFORM_ID);

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.initChart();
    this.initStat();
    this.initInvestors();
    this.initStartups();
  }

  initInvestors() {
    this.investors = [
      { name: 'Sequoia Capital', country: 'USA' },
      { name: 'Accel Partners', country: 'UK' },
      { name: 'Kima Ventures', country: 'France' },
      { name: 'SoftBank Vision Fund', country: 'Japan' },
      { name: 'Index Ventures', country: 'Switzerland' },
    ];
  }

  initStartups() {
    this.startups = [
      { name: 'GreenTech', status: 'En cours' },
      { name: 'MediCare+', status: 'En cours' },
      { name: 'AI Solutions', status: 'Terminé' },
      { name: 'EcoEnergy', status: 'En cours' },
      { name: 'FoodChainX', status: 'Terminé' }
    ];

    this.totalProjects = this.startups.length;
    this.ongoingProjects = this.startups.filter(s => s.status === 'En cours').length;
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      this.dataDonut = {
        labels: ['Tech & IA', 'Santé', 'Énergie'],
        datasets: [
          {
            data: [300, 150, 100],
            backgroundColor: ['#F6AEAE', '#ca9997', '#8c4442'],
            hoverBackgroundColor: ['#9d4a48', '#d4a6a4', '#703534'],
            borderWidth: 0
          }
        ]
      };

      this.optionsDonut = {
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#374151',
              font: { size: 14 }
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false
      };

      this.cd.markForCheck();
    }
  }

  initStat() {
    if (isPlatformBrowser(this.platformId)) {
      this.dataBar = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            type: 'bar',
            label: 'Dataset 1',
            backgroundColor: '#F6AEAE',
            data: [50, 25, 12, 48, 90, 76, 42]
          },
          {
            type: 'bar',
            label: 'Dataset 2',
            backgroundColor: '#ca9997',
            data: [21, 84, 24, 75, 37, 65, 34]
          },
          {
            type: 'bar',
            label: 'Dataset 3',
            backgroundColor: '#8c4442',
            data: [41, 52, 24, 74, 23, 21, 32]
          }
        ]
      };

      this.optionsBar = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          tooltip: { mode: 'index', intersect: false },
          legend: { labels: { color: '#374151', font: { size: 14 } } }
        },
        scales: {
          x: {
            stacked: true,
            ticks: { color: '#6b7280' },
            grid: { color: '#e5e7eb', drawBorder: false }
          },
          y: {
            stacked: true,
            ticks: { color: '#6b7280' },
            grid: { color: '#e5e7eb', drawBorder: false }
          }
        }
      };
      this.cd.markForCheck();
    }
  }
}
