import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

export interface News {
  id: number;
  title: string;
  category: string;
  location: string;
  news_date: string;
  startup_id: number;
  created_at: string;
  updated_at: string;
  image_url?: string;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CardModule, CommonModule, ButtonModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  newsList: News[] = [];
  filteredNews: News[] = [];
  loading = true;
  error = false;
  selectedView: 'list' | 'calendar' = 'list';
  selectedMonth: Date = new Date();
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.http.get<News[]>('http://127.0.0.1:8000/api/news')
      .pipe(
        catchError(error => {
          console.error('Error loading news:', error);
          this.error = true;
          this.loading = false;
          return of([]);
        })
      )
      .subscribe({
        next: (data) => {
          this.newsList = data;
          this.filteredNews = data;
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        }
      });
  }

  searchNews(event: any) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredNews = this.newsList.filter(news => {
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return news.title.toLowerCase().includes(searchLower) ||
               news.category.toLowerCase().includes(searchLower) ||
               news.location.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }

  setView(view: 'list' | 'calendar') {
    this.selectedView = view;
  }

  formatFullDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-EN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  formatDay(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).getDate().toString();
  }

  formatMonthShort(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-EN', { month: 'short' });
  }

  // Gestion calendrier

  getMonthNews(): News[] {
    const monthStart = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth(), 1);
    const monthEnd = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() + 1, 0);
    
    return this.filteredNews.filter(news => {
      if (!news.news_date) return false;
      const newsDate = new Date(news.news_date);
      return newsDate >= monthStart && newsDate <= monthEnd;
    });
  }

  changeMonth(direction: number) {
    this.selectedMonth = new Date(
      this.selectedMonth.getFullYear(),
      this.selectedMonth.getMonth() + direction,
      1
    );
  }

  getNewsDays(): {date: Date, news: News[]}[] {
    const days: {date: Date, news: News[]}[] = [];
    const lastDay = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() + 1, 0);
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth(), i);
      const dayNews = this.filteredNews.filter(news => {
        if (!news.news_date) return false;
        const newsDate = new Date(news.news_date);
        return this.isSameDay(newsDate, currentDate);
      });
      
      days.push({ date: currentDate, news: dayNews });
    }
    
    return days;
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDay(date, today);
  }

  getMonthName(): string {
    return new Intl.DateTimeFormat('en-EN', { month: 'long', year: 'numeric' }).format(this.selectedMonth);
  }
}