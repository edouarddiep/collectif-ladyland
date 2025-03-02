import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Accueil - Collectif Ladyland'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'À propos - Collectif Ladyland'
  },
  {
    path: 'concerts',
    loadComponent: () => import('./pages/concerts/concerts.component').then(m => m.ConcertsComponent),
    title: 'Concerts - Collectif Ladyland'
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent),
    title: 'Galerie - Collectif Ladyland'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact - Collectif Ladyland'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
