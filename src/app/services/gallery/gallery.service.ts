import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Media, MediaType } from '../../models/media.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  constructor(private apiService: ApiService) { }

  getAllMedia(): Observable<Media[]> {
    return this.apiService.getMedia();
  }

  getFeaturedMedia(): Observable<Media[]> {
    return this.apiService.getMedia().pipe(
      map(mediaList => mediaList.filter(media => media.featured))
    );
  }

  getMediaByType(type: MediaType): Observable<Media[]> {
    return this.apiService.getMedia().pipe(
      map(mediaList => mediaList.filter(media => media.type === type))
    );
  }

  getPhotos(): Observable<Media[]> {
    return this.getMediaByType(MediaType.PHOTO);
  }

  getVideos(): Observable<Media[]> {
    return this.getMediaByType(MediaType.VIDEO);
  }

  getAudio(): Observable<Media[]> {
    return this.getMediaByType(MediaType.AUDIO);
  }

  getMediaById(id: number): Observable<Media | undefined> {
    return this.apiService.getMediaById(id);
  }
}
