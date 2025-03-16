import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackbarContainer: HTMLDivElement | null = null;

  constructor() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeContainer();
    });
  }

  private initializeContainer(): void {
    if (!this.snackbarContainer) {
      this.snackbarContainer = document.createElement('div');
      this.snackbarContainer.className = 'snackbar-container';
      document.body.appendChild(this.snackbarContainer);
    }
  }

  show(message: string, type: 'success' | 'error' = 'success', duration: number = 3000): void {
    this.initializeContainer();

    const snackbar = document.createElement('div');
    snackbar.className = `snackbar ${type}`;
    snackbar.textContent = message;

    this.snackbarContainer?.appendChild(snackbar);

    // Animation d'entrée
    setTimeout(() => {
      snackbar.classList.add('show');
    }, 10);

    // Animation de sortie et suppression
    setTimeout(() => {
      snackbar.classList.remove('show');
      snackbar.addEventListener('transitionend', () => {
        snackbar.remove();
      });
    }, duration);
  }
}
