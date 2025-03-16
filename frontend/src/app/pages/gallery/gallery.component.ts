import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Media, MediaType } from '../../models/media.model';
import { GalleryService } from '../../services/gallery/gallery.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent implements OnInit {
  media$!: Observable<Media[]>;
  filteredMedia$!: Observable<Media[]>;

  activeFilter$ = new BehaviorSubject<string>('all');
  activeMediaId: number | null = null;

  MediaType = MediaType;

  constructor(private galleryService: GalleryService) { }

  ngOnInit(): void {
    this.media$ = this.galleryService.getAllMedia();

    this.filteredMedia$ = combineLatest([
      this.media$,
      this.activeFilter$
    ]).pipe(
      map(([media, filter]) => {
        if (filter === 'all') {
          return media;
        }
        return media.filter(item => item.type === filter);
      })
    );
  }

  setFilter(filter: string): void {
    this.activeFilter$.next(filter);
    this.activeMediaId = null;
  }

  isActiveFilter(filter: string): boolean {
    return this.activeFilter$.value === filter;
  }

  toggleMediaDetails(mediaId: number): void {
    if (this.activeMediaId === mediaId) {
      this.activeMediaId = null;
    } else {
      this.activeMediaId = mediaId;
    }
  }

  isActiveMedia(mediaId: number): boolean {
    return this.activeMediaId === mediaId;
  }

  getMediaTypeLabel(type: MediaType): string {
    switch (type) {
      case MediaType.PHOTO:
        return 'Photo';
      case MediaType.VIDEO:
        return 'Vidéo';
      case MediaType.AUDIO:
        return 'Audio';
      default:
        return 'Média';
    }
  }

  isSafeUrl(url: string): boolean {
    return (
      url.startsWith('https://www.youtube.com/embed/') ||
      url.startsWith('https://player.vimeo.com/video/') ||
      url.startsWith('https://soundcloud.com/') ||
      url.startsWith('https://open.spotify.com/') ||
      url.startsWith('/')
    );
  }

  /**
   * Retourne l'URL de la miniature appropriée pour l'élément média
   * Pour les photos, utilise l'URL principale si aucune miniature n'est définie
   * Pour les autres types, utilise la miniature ou une image par défaut
   */
  getThumbnailUrl(media: Media): string {
    // Si une miniature existe, l'utiliser quelle que soit le type
    if (media.thumbnailUrl) {
      return media.thumbnailUrl;
    }

    // Pour les photos, l'URL principale peut servir de miniature
    if (media.type === MediaType.PHOTO) {
      return media.url;
    }

    // Pour les autres types sans miniature, utiliser une image par défaut selon le type
    switch (media.type) {
      case MediaType.VIDEO:
        return '/assets/images/gallery/video-placeholder.jpg';
      case MediaType.AUDIO:
        return '/assets/images/gallery/audio-placeholder.jpg';
      default:
        return '/assets/images/gallery/default-thumb.jpg';
    }
  }
}
