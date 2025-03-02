import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Concert } from '../../models/concert.model';
import { Media } from '../../models/media.model';
import { ApiService } from '../../services/api/api.service';
import { GalleryService } from '../../services/gallery/gallery.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  upcomingConcerts$!: Observable<Concert[]>;
  featuredMedia$!: Observable<Media[]>;

  constructor(
    private apiService: ApiService,
    private galleryService: GalleryService
  ) { }

  ngOnInit(): void {
    this.upcomingConcerts$ = this.apiService.getUpcomingConcerts();
    this.featuredMedia$ = this.galleryService.getFeaturedMedia();
  }
}
