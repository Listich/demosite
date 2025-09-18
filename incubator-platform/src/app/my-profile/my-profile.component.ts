import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('api_token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/users', { headers: this.getHeaders() });
  }

  getUserInfos(): Observable<any> {
    return this.http.get<any>(`http://127.0.0.1:8000/api/me`, { headers: this.getHeaders() });
  }

  getUserImage(userId: number): Observable<Blob> {
    return this.http.get(`http://127.0.0.1:8000/api/users/${userId}/image`, { headers: this.getHeaders(), responseType: 'blob' });
  }
}


@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent {
  profileDetails = true;
  profileImage = true;
  user: any = [];
  userImageUrl?: string;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserInfos().subscribe(
      data => {
        this.user = data;
        this.profileDetails = true;
        this.userService.getUserImage(this.user.id).subscribe(
          blob => {
            this.userImageUrl = URL.createObjectURL(blob);
          },
          error => {
            this.userImageUrl = 'http://localhost:8000/storage/users/default.jpg';
            this.profileImage = false;
          }
        );
      },
      error => {
        this.profileDetails = false;
      }
    );
  }
}
