import { Injectable } from '@angular/core';
import { Observable, map, shareReplay, catchError, EMPTY, tap, of } from 'rxjs';
import { Media, MediaType } from '../../models/media.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private cachedMedia$: Observable<Media[]> | null = null;
  private expirationTime = 5 * 60 * 1000; // 5 minutes
  private lastFetchTime = 0;

  constructor(private apiService: ApiService) {}

  getAllMedia(): Observable<Media[]> {
    // Vérifier si le cache est valide
    if (this.cachedMedia$ && Date.now() - this.lastFetchTime < this.expirationTime) {
      return this.cachedMedia$;
    }

    // Mettre à jour le cache
    this.lastFetchTime = Date.now();
    this.cachedMedia$ = this.apiService.getMedias().pipe(
      map(media => this.preprocessMedia(media)),
      tap(media => console.log(`Loaded ${media.length} media items`)),
      shareReplay(1),
      catchError(error => {
        console.error('Error loading media:', error);
        return EMPTY;
      })
    );

    return this.cachedMedia$;
  }

  getFeaturedMedia(): Observable<Media[]> {
    return this.getAllMedia().pipe(
      map(mediaList => mediaList.filter(media => media.featured))
    );
  }

  getMediaByType(type: MediaType): Observable<Media[]> {
    return this.getAllMedia().pipe(
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
    // Chercher d'abord dans le cache
    if (this.cachedMedia$) {
      return this.cachedMedia$.pipe(
        map(mediaList => mediaList.find(item => item.id === id))
      );
    }

    // Sinon, faire une requête directe
    return this.apiService.getMediaById(id).pipe(
      map(media => this.preprocessMediaItem(media)),
      catchError(error => {
        console.error(`Error loading media with id ${id}:`, error);
        return of(undefined);
      })
    );
  }

  /**
   * Prétraiter les médias pour optimiser les performances
   */
  private preprocessMedia(media: Media[]): Media[] {
    return media.map(item => this.preprocessMediaItem(item));
  }

  /**
   * Prétraiter un élément média
   */
  private preprocessMediaItem(item: Media): Media {
    // Déterminer la catégorie d'album basée sur le contenu
    let albumId: string | undefined;

    if (item.type === MediaType.PHOTO) {
      if (this.isEventPhoto(item)) {
        albumId = 'events';
      } else if (this.isStudioPhoto(item)) {
        albumId = 'studio';
      } else {
        albumId = 'photos';
      }
    } else if (item.type === MediaType.VIDEO) {
      albumId = 'videos';
    } else if (item.type === MediaType.AUDIO) {
      albumId = 'audio';
    }

    // Retourner l'élément enrichi
    return {
      ...item,
      albumId
    };
  }

  /**
   * Vérifier si la photo est liée à un événement
   */
  private isEventPhoto(item: Media): boolean {
    return (
      item.title.toLowerCase().includes('concert') ||
      item.title.toLowerCase().includes('festival') ||
      (item.description?.toLowerCase().includes('concert') || false) ||
      (item.description?.toLowerCase().includes('festival') || false)
    );
  }

  /**
   * Vérifier si la photo est liée au studio
   */
  private isStudioPhoto(item: Media): boolean {
    return (
      item.title.toLowerCase().includes('studio') ||
      item.title.toLowerCase().includes('répétition') ||
      (item.description?.toLowerCase().includes('studio') || false) ||
      (item.description?.toLowerCase().includes('répétition') || false)
    );
  }

  /**
   * Nettoyer le cache
   */
  clearCache(): void {
    this.cachedMedia$ = null;
    this.lastFetchTime = 0;
  }
}
