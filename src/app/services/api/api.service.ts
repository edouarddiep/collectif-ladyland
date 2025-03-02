import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Artist } from '../../models/artist.model';
import { Concert } from '../../models/concert.model';
import { ContactForm, ContactResponse } from '../../models/contact.model';
import { Media } from '../../models/media.model';

// Pour l'instant, nous utilisons des données statiques simulées
// Plus tard, elles peuvent être remplacées par des appels API réels
import { ARTISTS_MOCK } from './mocks/artists.mock';
import { CONCERTS_MOCK } from './mocks/concerts.mock';
import { MEDIA_MOCK } from './mocks/media.mock';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Ceci serait l'URL de base de votre API backend
  private apiUrl = '/api';

  // Utilisé pour simuler des délais de réseau
  private delay = 500;

  constructor(private http: HttpClient) { }

  // Méthodes pour les Artists
  getArtists(): Observable<Artist[]> {
    // Simulation d'un appel API avec données mockées
    return of(ARTISTS_MOCK).pipe(
      map((artists: Artist[]) => [...artists]),
      catchError(this.handleError<Artist[]>('getArtists', []))
    );
  }

  getArtistById(id: number): Observable<Artist | undefined> {
    return of(ARTISTS_MOCK.find(artist => artist.id === id)).pipe(
      catchError(this.handleError<Artist | undefined>(`getArtist id=${id}`))
    );
  }

  // Méthodes pour les Concerts
  getConcerts(): Observable<Concert[]> {
    return of(CONCERTS_MOCK).pipe(
      map((concerts: Concert[]) => [...concerts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())),
      catchError(this.handleError<Concert[]>('getConcerts', []))
    );
  }

  getUpcomingConcerts(): Observable<Concert[]> {
    const today = new Date();

    return this.getConcerts().pipe(
      map((concerts: Concert[]) => concerts.filter(concert => new Date(concert.date) >= today))
    );
  }

  getPastConcerts(): Observable<Concert[]> {
    const today = new Date();

    return this.getConcerts().pipe(
      map((concerts: Concert[]) => concerts.filter(concert => new Date(concert.date) < today))
    );
  }

  getConcertById(id: number): Observable<Concert | undefined> {
    return of(CONCERTS_MOCK.find(concert => concert.id === id)).pipe(
      catchError(this.handleError<Concert | undefined>(`getConcert id=${id}`))
    );
  }

  // Méthodes pour les Médias
  getMedia(): Observable<Media[]> {
    return of(MEDIA_MOCK).pipe(
      map((media: Media[]) => [...media].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))),
      catchError(this.handleError<Media[]>('getMedia', []))
    );
  }

  getMediaById(id: number): Observable<Media | undefined> {
    return of(MEDIA_MOCK.find(media => media.id === id)).pipe(
      catchError(this.handleError<Media | undefined>(`getMedia id=${id}`))
    );
  }

  // Méthode pour envoyer un formulaire de contact
  submitContactForm(form: ContactForm): Observable<ContactResponse> {
    // Ici, on simule un appel API réussi
    return of({
      success: true,
      message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
    }).pipe(
      catchError(this.handleError<ContactResponse>('submitContactForm', {
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer plus tard.'
      }))
    );
  }

  // Gestionnaire d'erreur générique
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      // Permet à l'application de continuer en retournant un résultat vide ou par défaut
      return of(result as T);
    };
  }
}
