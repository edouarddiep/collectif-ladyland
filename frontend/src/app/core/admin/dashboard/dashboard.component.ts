import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import {DashboardDataService} from './service/dashboard-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats = {
    artists: 0,
    concerts: 0,
    upcomingConcerts: 0,
    media: 0,
    messages: 0
  };

  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public router: Router,
    private dashboardDataService: DashboardDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStats();

    // Déclencher un chargement initial des données
    this.dashboardDataService.triggerReload();

    // Recharger les statistiques lors des changements de route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        // Recharger les stats uniquement sur la page de dashboard principale
        if (this.router.url === '/admin/dashboard') {
          this.loadStats();
        }

        // Déclencher un rechargement pour les composants enfants
        this.dashboardDataService.triggerReload();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStats(): void {
    // Artistes
    this.http.get<any[]>('http://localhost:3000/api/artists').subscribe({
      next: data => {
        this.stats.artists = data.length;
        this.cdr.detectChanges();
      },
      error: error => console.error('Error loading artists stats:', error)
    });

    // Concerts
    this.http.get<any[]>('http://localhost:3000/api/concerts').subscribe({
      next: data => {
        this.stats.concerts = data.length;
        this.cdr.detectChanges();
      },
      error: error => console.error('Error loading concerts stats:', error)
    });

    // Concerts à venir
    this.http.get<any[]>('http://localhost:3000/api/concerts/upcoming').subscribe({
      next: data => {
        this.stats.upcomingConcerts = data.length;
        this.cdr.detectChanges();
      },
      error: error => console.error('Error loading upcoming concerts stats:', error)
    });

    // Médias
    this.http.get<any[]>('http://localhost:3000/api/media').subscribe({
      next: data => {
        this.stats.media = data.length;
        this.cdr.detectChanges();
      },
      error: error => console.error('Error loading media stats:', error)
    });

    // Messages
    this.http.get<any[]>('http://localhost:3000/api/contact').subscribe({
      next: data => {
        this.stats.messages = data.length;
        this.cdr.detectChanges();
      },
      error: error => console.error('Error loading contact stats:', error)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin']);
  }
}
