// src/app/admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConcertManagementComponent } from './concert-management/concert-management.component';
import { ArtistManagementComponent } from './artist-management/artist-management.component';
import { MediaManagementComponent } from './media-management/media-management.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'concerts', pathMatch: 'full' },
      { path: 'concerts', component: ConcertManagementComponent },
      { path: 'artists', component: ArtistManagementComponent },
      { path: 'media', component: MediaManagementComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
