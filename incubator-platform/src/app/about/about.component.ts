import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  getMemberImage(): Observable<Blob> {
    return this.http.get(`http://127.0.0.1:8000/storage/users/members/1.jpg`, { headers: this.getHeaders(), responseType: 'blob' });
  }

  getMember2Image(): Observable<Blob> {
    return this.http.get(`http://127.0.0.1:8000/storage/users/members/2.jpg`, { headers: this.getHeaders(), responseType: 'blob' });
  }

  getMember3Image(): Observable<Blob> {
    return this.http.get(`http://127.0.0.1:8000/storage/users/members/3.jpg`, { headers: this.getHeaders(), responseType: 'blob' });
  }

  getMember4Image(): Observable<Blob> {
    return this.http.get(`http://127.0.0.1:8000/storage/users/members/4.jpg`, { headers: this.getHeaders(), responseType: 'blob' });
  }
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  user: any = [];
  memberImageUrl?: string;
  member2ImageUrl?: string;
  member3ImageUrl?: string;
  member4ImageUrl?: string;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.memberImageUrl = 'http://localhost:8000/storage/users/4.jpg';
    this.member2ImageUrl = 'http://localhost:8000/storage/users/2.jpg';
    this.member3ImageUrl = 'http://localhost:8000/storage/users/6.jpg';
    this.member4ImageUrl = 'http://localhost:8000/storage/users/4.jpg';
  }
}