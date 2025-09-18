import { Component, Injectable, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// --------- Service ---------
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  private getHeaders() {
    let token = null;
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('api_token');
    }
    return {
      Authorization: `Bearer ${token ?? ''}`
    };
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/users', { headers: this.getHeaders() });
  }

  deleteUserbyID(id: string): Observable<void> {
    return this.http.delete<void>(`http://127.0.0.1:8000/api/users/${id}`, { headers: this.getHeaders() });
  }

  editUserbyID(user: User): Observable<User> {
    return this.http.put<User>(`http://127.0.0.1:8000/api/users/${user.id}`, user, { headers: this.getHeaders() });
  }

  createUserbyID(user: User): Observable<User> {
    return this.http.post<User>(`http://127.0.0.1:8000/api/users`, user, { headers: this.getHeaders() });
  }
}

// --------- Interfaces ---------
export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
}

// --------- Component ---------
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    FormsModule,
    DialogModule,
    ReactiveFormsModule
  ],
  providers: [MessageService]
})
export class ManageComponent implements OnInit {
  exampleForm: FormGroup = new FormGroup({});

  isInvalid(controlName: string): boolean {
    const control = this.exampleForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  onSubmit() {
    if (this.exampleForm.valid) {
      const formValue = this.exampleForm.value;
      console.log('Form submited with:', formValue);
      // Traite la soumission ici (ex appel API)
    } else {
      this.exampleForm.markAllAsTouched();
    }
  }

  users: User[] = [];
  clonedUsers: { [s: string]: User } = {};
  userDialog: boolean = false;
  selectedUser: any = {};

  constructor(
    private messageService: MessageService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.exampleForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error while loading users', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Errorr',
          detail: 'Unable to load users'
        });
      }
    });
  }

  // --- Users CRUD ---
  onUserEditInit(user: User) {
    this.clonedUsers[user.id as string] = { ...user };
  }

  onUserEditSave(user: User) {
    if (user.name.trim()) {
      this.userService.editUserbyID(user).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          delete this.clonedUsers[user.id as string];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated' });
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

  onUserEditCancel(user: User, index: number) {
    this.users[index] = this.clonedUsers[user.id as string];
    delete this.clonedUsers[user.id as string];
  }

  openNewUser() {
    this.selectedUser = {};
    this.userDialog = true;
  }

  saveUser() {
    if (!this.selectedUser.name || !this.selectedUser.email || !this.selectedUser.role || !this.selectedUser.password) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "All the fields are required" });
      return;
    }

    if (!this.selectedUser.id) {
      this.userService.createUserbyID(this.selectedUser).subscribe({
        next: (createdUser) => {
          this.users.push(createdUser);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User created' });
          this.userDialog = false;
          this.selectedUser = {};
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error on creation' });
          console.error('Error while creating user:', err);
        }
      });
    } else {
      this.userService.editUserbyID(this.selectedUser).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User edited' });
          this.userDialog = false;
          this.selectedUser = {};
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error on edit' });
          console.error('Error while editing user:', err);
        }
      });
    }
  }

  deleteUser(id: string) {
    this.users = this.users.filter(u => u.id !== id);
    this.userService.deleteUserbyID(id).subscribe({
      next: () => { },
      error: (err) => {
        console.error('Error on deleting:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error on deleting' });
      }
    });
    this.messageService.add({ severity: 'info', summary: 'Deleted', detail: 'User deleted' });
  }

  addUser() {
    this.openNewUser();
  }
}
