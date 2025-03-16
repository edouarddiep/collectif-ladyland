import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaType } from '../../../models/media.model';
import {Album} from '../../../models/album.model';

@Component({
  selector: 'app-gallery-album',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-album.component.html',
  styleUrls: ['./gallery-album.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryAlbumComponent {
  @Input() album!: Album;
  @Output() albumClick = new EventEmitter<void>();

  MediaType = MediaType;

  onClick(): void {
    this.albumClick.emit();
  }

  getAlbumIcon(): string {
    switch (this.album.type) {
      case MediaType.PHOTO:
        return 'fa-images';
      case MediaType.VIDEO:
        return 'fa-video';
      case MediaType.AUDIO:
        return 'fa-music';
      default:
        return 'fa-folder';
    }
  }
}
