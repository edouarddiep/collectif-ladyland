import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Media, MediaType } from '../../../models/media.model';

@Component({
  selector: 'app-gallery-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-item.component.html',
  styleUrls: ['./gallery-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryItemComponent {
  @Input() media!: Media;
  @Input() isActive = false;
  @Output() itemClick = new EventEmitter<void>();

  MediaType = MediaType;
  isLoaded = false;

  constructor(private el: ElementRef) {}

  onItemClick(): void {
    this.itemClick.emit();
  }

  onImageLoad(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.classList.add('loaded');
    this.isLoaded = true;
  }

  getMediaTypeLabel(): string {
    switch (this.media.type) {
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

  getThumbnailUrl(): string {
    // Si une miniature existe, l'utiliser
    if (this.media.thumbnailUrl) {
      return this.media.thumbnailUrl;
    }

    // Pour les photos, l'URL principale peut servir de miniature
    if (this.media.type === MediaType.PHOTO) {
      return this.media.url;
    }

    // Pour les autres types sans miniature, utiliser une image par défaut selon le type
    switch (this.media.type) {
      case MediaType.VIDEO:
        return '/assets/images/gallery/video-placeholder.jpg';
      case MediaType.AUDIO:
        return '/assets/images/gallery/audio-placeholder.jpg';
      default:
        return '/assets/images/gallery/default-thumb.jpg';
    }
  }

  getPlaceholderImage(): string {
    // Image de faible résolution à charger immédiatement
    switch (this.media.type) {
      case MediaType.PHOTO:
        return '/assets/images/gallery/photo-blur-placeholder.jpg';
      case MediaType.VIDEO:
        return '/assets/images/gallery/video-blur-placeholder.jpg';
      case MediaType.AUDIO:
        return '/assets/images/gallery/audio-blur-placeholder.jpg';
      default:
        return '/assets/images/gallery/default-blur-placeholder.jpg';
    }
  }
}
