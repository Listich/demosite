import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { User } from '../manage/manage.component';

// --------- Interfaces ---------
export interface Startup {
  id?: string;
  name: string;
  legal_status: string;
  address: string;
  email: string;
  phone: string;
  sector: string;
  maturity: string;
}

// --------- Service ---------
@Injectable({ providedIn: 'root' })
export class StartupService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('api_token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getStartups() {
    return this.http.get<Startup[]>('http://127.0.0.1:8000/api/startups', {
      headers: this.getHeaders()
    });
  }

  deleteStartupbyID(id: string): Observable<void> {
    return this.http.delete<void>(`http://127.0.0.1:8000/api/startups/${id}`, { headers: this.getHeaders() });
  }

  editStartupbyID(startup: Startup): Observable<Startup> {
    return this.http.put<Startup>(`http://127.0.0.1:8000/api/startups/${startup.id}`, startup, { headers: this.getHeaders() });
  }

  createStartupbyID(startup: Startup): Observable<Startup> {
    return this.http.post<Startup>(`http://127.0.0.1:8000/api/startups`, startup, { headers: this.getHeaders() });
  }
}

@Component({
  selector: 'app-manage-startups',
  templateUrl: './manage-startups.component.html',
  styleUrls: ['./manage-startups.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    ToastModule
  ],
  providers: [MessageService, StartupService]
})
export class ManageStartupsComponent implements OnInit {
  startups: Startup[] = [];
  clonedStartups: { [s: string]: Startup } = {};
  startupDialog: boolean = false;
  selectedStartup: Startup = {} as Startup;
  loading: boolean = true;

  constructor(
    private startupService: StartupService, 
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadStartups();
  }

  // 🔹 Récupérer les startups depuis l'API
  loadStartups() {
    this.loading = true;
    this.startupService.getStartups().subscribe({
      next: (data) => {
        this.startups = data;
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Startups loaded successfully'
        });
      },
      error: (err) => {
        console.error('Error while laoding the data', err);
        this.loading = false;
        
        let errorDetail = 'Unable to load the startups';
        if (err.status === 401) {
          errorDetail = 'Not authorized, please reconnect';
        } else if (err.status === 403) {
          errorDetail = "Access denied, you don't have the right needed";
        } else if (err.status === 0) {
          errorDetail = 'Unable to connect to the servers, please verify your connection';
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorDetail
        });
      }
    });
  }

  // --- CRUD Startups ---
  onRowEditInit(startup: Startup) {
    this.clonedStartups[startup.id as string] = { ...startup };
  }

  onRowEditSave(startup: Startup) {
    if (startup.name.trim()) {
      delete this.clonedStartups[startup.id as string];
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Startup updated' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The name is required' });
    }
  }

  onRowEditCancel(startup: Startup, index: number) {
    this.startups[index] = this.clonedStartups[startup.id as string];
    delete this.clonedStartups[startup.id as string];
  }

  deleteStartup(id: string) {
    this.startups = this.startups.filter(u => u.id !== id);
    this.startupService.deleteStartupbyID(id).subscribe({
      next: () => { },
      error: (err) => {
        console.error('Error on deleting:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error on deleting' });
      }
    });
    this.messageService.add({ severity: 'info', summary: 'Deleted', detail: 'User deleted' });
  }

  openNewStartup() {
    this.selectedStartup = {} as Startup;
    this.startupDialog = true;
  }

  openEditStartup(startup: Startup) {
    this.selectedStartup = { ...startup };
    this.startupDialog = true;
  }

  saveStartup() {
    if (!this.selectedStartup.name || !this.selectedStartup.legal_status || !this.selectedStartup.address || !this.selectedStartup.email || !this.selectedStartup.phone || !this.selectedStartup.sector || !this.selectedStartup.maturity) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "All the fields are required" });
      return;
    }

    if (!this.selectedStartup.id) {
      this.startupService.createStartupbyID(this.selectedStartup).subscribe({
        next: (createdStartup) => {
          this.startups.push(createdStartup);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Startup created' });
          this.startupDialog = false;
          this.selectedStartup = {
            id: undefined,
            name: '',
            legal_status: '',
            address: '',
            email: '',
            phone: '',
            sector: '',
            maturity: ''
          };
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error on creation' });
          console.error('Error while creating startup:', err);
        }
      });
    } else {
      this.startupService.editStartupbyID(this.selectedStartup).subscribe({
        next: (updatedStartup) => {
          const index = this.startups.findIndex(u => u.id === updatedStartup.id);
          if (index !== -1) {
            this.startups[index] = updatedStartup;
          }
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Startup edited' });
          this.startupDialog = false;
          this.selectedStartup = {
            id: undefined,
            name: '',
            legal_status: '',
            address: '',
            email: '',
            phone: '',
            sector: '',
            maturity: ''
          };
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error on edit' });
          console.error('Error while editing startup:', err);
        }
      });
    }
  }
}
