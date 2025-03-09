import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../../models/artist.model';
import { Concert } from '../../models/concert.model';
import { Media } from '../../models/media.model';
import { ContactForm, ContactResponse } from '../../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; // URL de votre API NestJS

  constructor(private http: HttpClient) { }

  // Artistes
  getArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.apiUrl}/artists`);
  }

  getArtistById(id: number): Observable<Artist> {
    return this.http.get<Artist>(`${this.apiUrl}/artists/${id}`);
  }

  // Concerts
  getConcerts(): Observable<Concert[]> {
    return this.http.get<Concert[]>(`${this.apiUrl}/concerts`);
  }

  getUpcomingConcerts(): Observable<Concert[]> {
    return this.http.get<Concert[]>(`${this.apiUrl}/concerts/upcoming`);
  }

  getPastConcerts(): Observable<Concert[]> {
    return this.http.get<Concert[]>(`${this.apiUrl}/concerts/past`);
  }

  // Media
  getMedias(): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.apiUrl}/media`);
  }

  getMediaById(id: number): Observable<Media> {
    return this.http.get<Media>(`${this.apiUrl}/media/${id}`);
  }

  // Contact
  submitContactForm(form: ContactForm): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.apiUrl}/contact`, form);
  }
}
