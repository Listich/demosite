import { Component, Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

// -------- Interface --------
export interface Project {
  id?: string;
  name: string;
  description: string;
  founders: string;
  contacts: string;
  progress: string;
  needs: [];
  links: string;
}

// -------- Service --------
@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private getHeaders() {
    let token = null;
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('api_token');
    }
    return {
      Authorization: `Bearer ${token ?? ''}`
    };
  }

  deleteProjectbyID(id: string): Observable<void> {
    return this.http.delete<void>(`http://127.0.0.1:8000/api/projects/${id}`, { headers: this.getHeaders() });
  }

  editProjectbyID(project: Project): Observable<Project> {
    return this.http.put<Project>(`http://127.0.0.1:8000/api/projects/${project.id}`, project, { headers: this.getHeaders() });
  }

  createProjectbyID(project: Project): Observable<Project> {
    return this.http.post<Project>(`http://127.0.0.1:8000/api/projects`, project, { headers: this.getHeaders() });
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('http://127.0.0.1:8000/api/projects', {
      headers: this.getHeaders()
    });
  }
}

// -------- Component --------
@Component({
  selector: 'app-manage-projects',
  templateUrl: './crud-project.component.html',
  styleUrls: ['./crud-project.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    DialogModule
  ],
  providers: [MessageService]
})
export class ManageProjectsComponent implements OnInit {
  projects: Project[] = [];
  clonedProjects: { [s: string]: Project } = {};
  projectDialog: boolean = false;
  selectedProject: Project = {} as Project;

  constructor(private projectService: ProjectService, private messageService: MessageService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: data => this.projects = data,
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

  // CRUD local
  onProjectEditInit(project: Project) {
    this.clonedProjects[project.id as string] = { ...project };
  }

  onProjectEditSave(project: Project) {
    if (project.name.trim()) {
      this.projectService.editProjectbyID(project).subscribe({
        next: (updatedProject) => {
          const index = this.projects.findIndex(u => u.id === updatedProject.id);
          if (index !== -1) {
            this.projects[index] = updatedProject;
          }
          delete this.clonedProjects[project.id as string];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project updated' });
        },
        error: (err) => {
          console.error('Error on editing:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error on editing' });
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The name is required' });
    }
  }

  onProjectEditCancel(project: Project, index: number) {
    this.projects[index] = this.clonedProjects[project.id as string];
    delete this.clonedProjects[project.id as string];
  }

  openNewProject() {
    this.selectedProject = {
      id: undefined,
      name: '',
      description: '',
      founders: '',
      contacts: '',
      progress: '',
      needs: [],
      links: ''
    }
    this.projectDialog = true;
  }

  saveProject() {
    if (!this.selectedProject.name || !this.selectedProject.description || !this.selectedProject.founders || !this.selectedProject.contacts || !this.selectedProject.progress || !this.selectedProject.links) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "All the fields are required" });
      return;
    }

    if (!this.selectedProject.id) {
      this.projectService.createProjectbyID(this.selectedProject).subscribe({
        next: (createdProject) => {
          this.projects.push(createdProject);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project created' });
          this.projectDialog = false;
          this.selectedProject = {
            id: undefined,
            name: '',
            description: '',
            founders: '',
            contacts: '',
            progress: '',
            needs: [],
            links: ''
          };
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error on creation' });
          console.error('Error while creating user:', err);
        }
      });
    } else {
      this.projectService.editProjectbyID(this.selectedProject).subscribe({
        next: (updatedProject) => {
          const index = this.projects.findIndex(u => u.id === updatedProject.id);
          if (index !== -1) {
            this.projects[index] = updatedProject;
          }
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project edited' });
          this.projectDialog = false;
          this.selectedProject = {
            id: undefined,
            name: '',
            description: '',
            founders: '',
            contacts: '',
            progress: '',
            needs: [],
            links: ''
          };
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error on edit' });
          console.error('Error while editing user:', err);
        }
      });
    }
    this.projectDialog = false;
  }

  deleteProject(id: string) {
    this.projects = this.projects.filter(u => u.id !== id);
    this.projectService.deleteProjectbyID(id).subscribe({
      next: () => { },
      error: (err) => {
        console.error('Error on deleting:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error on deleting' });
      }
    });
    this.messageService.add({ severity: 'info', summary: 'Deleted', detail: 'Project deleted' });
  }
}
