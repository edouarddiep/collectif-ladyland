import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private tokenKey = 'admin_token';
  private currentUserSubject: BehaviorSubject<AuthResponse | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredToken());
  }

  private getStoredToken(): AuthResponse | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        return JSON.parse(token);
      } catch (e) {
        localStorage.removeItem(this.tokenKey);
      }
    }
    return null;
  }

  public get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(map(response => {
        // Stocker le token dans le localStorage
        localStorage.setItem(this.tokenKey, JSON.stringify(response));
        this.currentUserSubject.next(response);
        return response;
      }));
  }

  logout(): void {
    // Supprimer le token du localStorage
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/admin']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  getAuthToken(): string | null {
    const currentUser = this.currentUserValue;
    return currentUser ? currentUser.access_token : null;
  }
}
