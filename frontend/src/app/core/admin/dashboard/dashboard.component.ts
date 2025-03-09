import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = {
    artists: 0,
    concerts: 0,
    upcomingConcerts: 0,
    media: 0,
    messages: 0
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Artistes
    this.http.get<any[]>('http://localhost:3000/api/artists').subscribe(data => {
      this.stats.artists = data.length;
    });

    // Concerts
    this.http.get<any[]>('http://localhost:3000/api/concerts').subscribe(data => {
      this.stats.concerts = data.length;
    });

    // Concerts à venir
    this.http.get<any[]>('http://localhost:3000/api/concerts/upcoming').subscribe(data => {
      this.stats.upcomingConcerts = data.length;
    });

    // Médias
    this.http.get<any[]>('http://localhost:3000/api/media').subscribe(data => {
      this.stats.media = data.length;
    });

    // Messages
    this.http.get<any[]>('http://localhost:3000/api/contact').subscribe(data => {
      this.stats.messages = data.length;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin']);
  }
}
