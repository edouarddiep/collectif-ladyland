// src/app/admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConcertManagementComponent } from './concert-management/concert-management.component';
import { ArtistManagementComponent } from './artist-management/artist-management.component';
import { MediaManagementComponent } from './media-management/media-management.component';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    ConcertManagementComponent,
    ArtistManagementComponent,
    MediaManagementComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
