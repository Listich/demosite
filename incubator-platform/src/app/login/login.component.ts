import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

declare var localStorage: any;

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/login', { email, password });
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showForm = false;
  userType: 'admin' | 'founder' | null = null;
  login: any[] = [];

  email: string = '';
  password: string = '';
  problem: string = '';

  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit() {
    if (this.router.url === '/login') {
      this.showForm = true;
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;

    if (this.showForm) {
      this.showForm = false;
      this.router.navigate(['/login']);
    } else {
      this.showForm = false;
      this.router.navigate(['/'])
    }
  }

  onSubmit() {
    this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.token) {
          localStorage.setItem('api_token', response.token);
          const role = response.user.role;
          if (role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (role === 'founder') {
            this.router.navigate(['/startups']);
          } else {
            this.router.navigate(['/']);
          }
          this.showForm = false;
          this.problem = '';
        } else {
          this.problem = 'Error when trying to connect.';
        }
      },
      error: (err) => {
        this.problem = "Email or password incorrect.";
        console.error('Login error', err);
      }
    });
  }

  setUserType(type: 'admin' | 'founder') {
    this.userType = type;
  }
}
