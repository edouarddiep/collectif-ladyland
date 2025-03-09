import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Accueil - Collectif Ladyland'
  },
 {
    path: 'admin',
    loadComponent: () => import('./core/admin/login/login.component').then(m => m.LoginComponent),
    title: 'Admin Login - Collectif Ladyland'
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./core/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Admin Dashboard - Collectif Ladyland',
    children: [
      {
        path: 'concerts',
        loadComponent: () => import('./core/admin/concert-management/concert-management.component').then(m => m.ConcertManagementComponent)
      },
      {
        path: 'artists',
        loadComponent: () => import('./core/admin/artist-management/artist-management.component').then(m => m.ArtistManagementComponent)
      },
      {
        path: 'media',
        loadComponent: () => import('./core/admin/media-management/media-management.component').then(m => m.MediaManagementComponent)
      },
      { path: '', redirectTo: 'concerts', pathMatch: 'full' }
    ]
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
