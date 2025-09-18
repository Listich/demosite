import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

import { NewsComponent } from './news/news.component';
import { EventsComponent } from './events/events.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { AboutComponent } from './about/about.component';
import { StartupsComponent } from './startups/startups.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { StartupsLayoutComponent } from './startups-layout/startups-layout.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MessagingComponent } from './messaging/messaging.component';
import { OpportunitiesComponent } from './opportunities/opportunities.component';
import { ManageComponent } from './manage/manage.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { ManageStartupsComponent } from './manage-startups/manage-startups.component';
import { ManageProjectsComponent } from './crud-project/crud-project.component';
import { ProjectsComponent } from './project/project.component';


export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
        { path: '', component: HomeComponent},
        { path: 'login', component: LoginComponent },
        { path: 'projects', component: ProjectsComponent },
        { path: 'news', component: NewsComponent },
        { path: 'events', component: EventsComponent },
        { path: 'advanced-search', component: AdvancedSearchComponent },
        { path: 'about', component: AboutComponent }
        ]
    },
    {
        path: 'startups',
        component: StartupsLayoutComponent,
        children: [
        { path: '', component: StartupsComponent },
        { path: 'login', component: LoginComponent },
        { path: 'my-profile', component: MyProfileComponent},
        { path: 'messaging', component: MessagingComponent},
        { path: 'opportunities', component: OpportunitiesComponent},
        { path: 'manage', component: ManageComponent},
        ]
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            { path: '', component: StartupsComponent },
            { path: 'login', component: LoginComponent },
            { path: 'user', component: ManageComponent },
            { path: 'startup', component: ManageStartupsComponent},
            { path: 'projects', component: ManageProjectsComponent},
            { path: 'opportunities', component: OpportunitiesComponent},
            { path: 'manage', component: ManageComponent},
        ]
    }
]
