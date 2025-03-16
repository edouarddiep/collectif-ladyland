import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaType } from '../../../models/media.model';

@Component({
  selector: 'app-gallery-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-filter.component.html',
  styleUrls: ['./gallery-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryFilterComponent {
  @Input() activeFilter: string | null = 'all';
  @Input() viewMode: 'grid' | 'albums' = 'albums';
  @Input() albumId: string | null = null;

  @Output() filterChange = new EventEmitter<string>();
  @Output() backToAlbums = new EventEmitter<void>();

  MediaType = MediaType;

  onFilterChange(filter: string): void {
    this.filterChange.emit(filter);
  }

  onBackClick(): void {
    this.backToAlbums.emit();
  }

  isActiveFilter(filter: string): boolean {
    return this.activeFilter === filter;
  }

  getAlbumName(): string {
    if (!this.albumId) return '';

    switch (this.albumId) {
      case 'photos':
        return 'Photos';
      case 'videos':
        return 'Vidéos';
      case 'audio':
        return 'Audio';
      case 'events':
        return 'Événements';
      case 'studio':
        return 'Studio';
      default:
        return this.albumId;
    }
  }
}
