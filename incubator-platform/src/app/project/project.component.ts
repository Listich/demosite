import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

export interface Project {
  id?: string;
  name: string;
  description: string;
  founders: string;
  sector: string;
  maturity: string;
  location: string;
  progress: string;
  needs: string;
  links: string;
}

interface DropdownOption {
  label: string;
  value: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private http: HttpClient) {}

  private getHeaders(): { [header: string]: string } {
    const token = localStorage.getItem('api_token') || '';
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('http://127.0.0.1:8000/api/projects', {
      headers: this.getHeaders()
    });
  }
}

@Component({
  selector: 'app-projects',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    TooltipModule
  ],
  providers: [MessageService, ProjectService]
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  
  searchText: string = '';
  selectedSector: string | null = null;
  selectedMaturity: string | null = null;
  selectedLocation: string | null = null;
  
  sectorOptions: DropdownOption[] = [];
  maturityOptions: DropdownOption[] = [];
  locationOptions: DropdownOption[] = [];
  
  projectDialog: boolean = false;
  selectedProject: Project | null = null;

  constructor(
    private projectService: ProjectService, 
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: data => {
        this.projects = data;
        this.filteredProjects = [...this.projects];
        
        this.sectorOptions = this.getUniqueOptions('sector');
        this.maturityOptions = this.getUniqueOptions('maturity');
        this.locationOptions = this.getLocationOptions();
      },
      error: err => {
        console.error('Erreur lors du chargement des projets', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les projets'
        });
      }
    });
  }
  
  // Méthode pour extraire la ville d'une adresse complète
  extractCityFromAddress(address: string): string {
    if (!address) return '';
    
    // Séparer l'adresse par les virgules
    const parts = address.split(',');
    
    // Prendre le dernier élément (généralement la ville)
    const city = parts[parts.length - 1].trim();
    
    return city;
  }
  
  // Méthode pour obtenir les options de localisation basées sur les villes
  getLocationOptions(): DropdownOption[] {
    // Extraire les villes uniques de toutes les adresses
    const uniqueCities = [...new Set(
      this.projects
        .map(p => this.extractCityFromAddress(p.location))
        .filter(city => city !== '')
    )];
    
    return uniqueCities
      .map(city => ({ label: city, value: city }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
  
  getUniqueOptions(field: keyof Project): DropdownOption[] {
    const uniqueValues = [...new Set(this.projects.map(p => p[field]).filter(val => val !== undefined && val !== ''))];
    
    return uniqueValues
      .filter((value): value is string => typeof value === 'string')
      .map(value => ({ label: value, value: value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
  
  applyFilters() {
    this.filteredProjects = this.projects.filter(project => {
      // Filtre par texte de recherche
      if (this.searchText) {
        const searchLower = this.searchText.toLowerCase();
        if (!project.name.toLowerCase().includes(searchLower) &&
            !project.description.toLowerCase().includes(searchLower) &&
            !project.founders.toLowerCase().includes(searchLower) &&
            !project.sector.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      // Filtre par secteur
      if (this.selectedSector && project.sector !== this.selectedSector) {
        return false;
      }
      
      // Filtre par maturité
      if (this.selectedMaturity && project.maturity !== this.selectedMaturity) {
        return false;
      }
      
      // Filtre par localisation (ville)
      if (this.selectedLocation) {
        const projectCity = this.extractCityFromAddress(project.location);
        if (projectCity !== this.selectedLocation) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  clearFilters() {
    this.searchText = '';
    this.selectedSector = null;
    this.selectedMaturity = null;
    this.selectedLocation = null;
    this.filteredProjects = [...this.projects];
  }
  
  hasActiveFilters(): boolean {
    return !!(this.searchText || this.selectedSector || this.selectedMaturity || this.selectedLocation);
  }

  getMaturityClass(maturity: string): string {
    const maturityMap: {[key: string]: string} = {
      'seed': 'seed',
      'démarrage': 'seed',
      'startup': 'growth',
      'croissance': 'growth',
      'série-a': 'series-a',
      'série-b': 'series-a',
      'établi': 'established',
      'mature': 'established'
    };
    
    return maturityMap[maturity.toLowerCase()] || 'seed';
  }

  viewProjectDetails(project: Project) {
    this.selectedProject = { ...project };
    this.projectDialog = true;
  }

  openProjectLinks(project: Project) {
    if (project.links) {
      window.open(project.links, '_blank');
    }
  }
}
