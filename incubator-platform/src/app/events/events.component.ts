import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

export interface Event {
  id: number;
  name: string;
  description: string;
  dates: string; // Peut être une date unique ou une plage de dates
  localisation: string;
  image_url?: string;
  updated_at: string;
  start_time?: string;
  end_time?: string;
  category?: string;
  price?: number;
  capacity?: number;
  registration_link?: string;
  start_date?: string;
  end_date?: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading = true;
  error = false;
  selectedView: 'list' | 'calendar' = 'list';
  selectedMonth: Date = new Date();
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.http.get<Event[]>('http://127.0.0.1:8000/api/events')
      .pipe(
        catchError(error => {
          console.error('Error loading events:', error);
          this.error = true;
          this.loading = false;
          return of([]);
        })
      )
      .subscribe({
        next: (data) => {
          this.events = this.processEvents(data);
          this.filteredEvents = this.events;
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        }
      });
  }

  processEvents(events: Event[]): Event[] {
    return events.map(event => {
      const processedEvent = { ...event };
      
      if (event.dates.includes(' - ')) {
        const [startDate, endDate] = event.dates.split(' - ');
        processedEvent.start_date = startDate.trim();
        processedEvent.end_date = endDate.trim();
      } else {
        processedEvent.start_date = event.dates;
        processedEvent.end_date = event.dates;
      }
      
      return processedEvent;
    });
  }

  searchEvents(event: any) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredEvents = this.events.filter(event => {
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return event.name.toLowerCase().includes(searchLower) ||
               event.description.toLowerCase().includes(searchLower) ||
               event.localisation.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }

  setView(view: 'list' | 'calendar') {
    this.selectedView = view;
  }

  // --- 📅 Formatages ---
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

  formatTime(timeString?: string): string {
    if (!timeString) return '';
    return new Intl.DateTimeFormat('en-EN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(`2000-01-01T${timeString}`));
  }

  // --- 📆 Gestion du calendrier ---
  getMonthEvents(): Event[] {
    const monthStart = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth(), 1);
    const monthEnd = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() + 1, 0);
    
    return this.filteredEvents.filter(event => {
      if (!event.start_date) return false;
      const eventDate = new Date(event.start_date);
      return eventDate >= monthStart && eventDate <= monthEnd;
    });
  }

  changeMonth(direction: number) {
    this.selectedMonth = new Date(
      this.selectedMonth.getFullYear(),
      this.selectedMonth.getMonth() + direction,
      1
    );
  }

  getEventDays(): {date: Date, events: Event[]}[] {
    const days: {date: Date, events: Event[]}[] = [];
    const lastDay = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() + 1, 0);
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth(), i);
      const dayEvents = this.filteredEvents.filter(event => {
        if (!event.start_date) return false;
        const eventDate = new Date(event.start_date);
        return this.isSameDay(eventDate, currentDate);
      });
      
      days.push({ date: currentDate, events: dayEvents });
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
