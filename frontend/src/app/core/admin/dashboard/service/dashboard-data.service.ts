// src/app/core/admin/dashboard-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Service qui force le rechargement des données lors de la navigation
 * Résout le problème de données qui ne se chargent pas automatiquement
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private reloadDataSubject = new BehaviorSubject<boolean>(true);
  reloadData$ = this.reloadDataSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.triggerReload();
    });
  }

  triggerReload(): void {
    this.reloadDataSubject.next(true);
  }
}
