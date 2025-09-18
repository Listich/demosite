import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { MenuStartupsComponent } from './menu-startups/menu-startups.component';
import { ManageProjectsComponent } from './crud-project/crud-project.component';
import { NewsComponent } from './news/news.component';
import { EventsComponent } from './events/events.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { AboutComponent } from './about/about.component';
import { StartupsComponent } from './startups/startups.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MessagingComponent } from './messaging/messaging.component';
import { OpportunitiesComponent } from './opportunities/opportunities.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoginComponent,
    MenuComponent,
    MenuStartupsComponent,
    ManageProjectsComponent,
    NewsComponent,
    EventsComponent,
    AdvancedSearchComponent,
    AboutComponent,
    StartupsComponent,
    MyProfileComponent,
    MessagingComponent,
    OpportunitiesComponent,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showDownloadCard = false;
  title = 'incubator-platform';

  constructor(private http: HttpClient, private router: Router) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('api_token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  ngOnInit() {
    this.checkRoute(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkRoute(event.urlAfterRedirects);
    });
  }

  private checkRoute(url: string) {
    if (!url.startsWith('/')) {
      url = '/' + url;
    }
    this.showDownloadCard = url.startsWith('/startups') || url.startsWith('/admin');
  }


  downloadPitchdesk() {
    this.http.get('http://127.0.0.1:8000/api/export/pitchdeck', {
      headers: this.getHeaders(),
      responseType: 'blob'
    }).subscribe(blob => {
      saveAs(blob, 'pitchdeck.pdf');
    }, error => {
      console.error('Erreur téléchargement:', error);
    });
  }
}

