# collectif-ladyland

## À propos du projet

Ce projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version     "@angular/core": "^19.2.0",.

## Structure du projet

```
src/
├── app/               # Composants principaux et configuration
├── assets/            # Images, polices et autres ressources statiques
├── environments/      # Configurations d'environnement
└── styles/            # Styles globaux
```

## Statistiques du projet

- **Composants**:       14
- **Services**:        5
- **Modèles/Interfaces**:        4
- **Tests**:        2
- **Pages**:        5

## Routes de l'application

Voici les principales routes de l'application :

| Route | Description | Composant |
| --- | --- | --- |
| `` | title: 'Accueil - Collectif Ladyland' | ./pages/home/home.component |
| `loadComponent: () => import(./pages/home/home.component).then(m => m.HomeComponent)` | Route loadComponent: () => import(./pages/home/home.component).then(m => m.HomeComponent) |  |
| `title: Accueil - Collectif Ladyland` | Route title: Accueil - Collectif Ladyland |  |
| `admin` | title: 'Admin Login - Collectif Ladyland' | ./core/admin/login/login.component |
| `loadComponent: () => import(./core/admin/login/login.component).then(m => m.LoginComponent)` | Route loadComponent: () => import(./core/admin/login/login.component).then(m => m.LoginComponent) |  |
| `title: Admin Login - Collectif Ladyland` | Route title: Admin Login - Collectif Ladyland |  |
| `admin/dashboard` | Admin Dashboard - Collectif Ladyland | ./core/admin/dashboard/dashboard.component |
| `loadComponent: () => import(./core/admin/dashboard/dashboard.component).then(m => m.DashboardComponent)` | Route loadComponent: () => import(./core/admin/dashboard/dashboard.component).then(m => m.DashboardComponent) |  |
| `title: Admin Dashboard - Collectif Ladyland` | Route title: Admin Dashboard - Collectif Ladyland |  |
| `concerts` | title: 'Concerts - Collectif Ladyland' | ./core/admin/concert-management/concert-management.component |
| `loadComponent: () => import(./core/admin/concert-management/concert-management.component).then(m => m.ConcertManagementComponent)` | Route loadComponent: () => import(./core/admin/concert-management/concert-management.component).then(m => m.ConcertManagementComponent) |  |
| `runGuardsAndResolvers: always` | Route runGuardsAndResolvers: always |  |
| `artists` | Route artists | ./core/admin/artist-management/artist-management.component |
| `loadComponent: () => import(./core/admin/artist-management/artist-management.component).then(m => m.ArtistManagementComponent)` | Route loadComponent: () => import(./core/admin/artist-management/artist-management.component).then(m => m.ArtistManagementComponent) |  |
| `runGuardsAndResolvers: always` | Route runGuardsAndResolvers: always |  |
| `media` | Route media | ./core/admin/media-management/media-management.component |
| `loadComponent: () => import(./core/admin/media-management/media-management.component).then(m => m.MediaManagementComponent)` | Route loadComponent: () => import(./core/admin/media-management/media-management.component).then(m => m.MediaManagementComponent) |  |
| `runGuardsAndResolvers: always` | Route runGuardsAndResolvers: always |  |
| `contacts` | Route contacts | ./core/admin/contact-management/contact-management.component |
| `loadComponent: () => import(./core/admin/contact-management/contact-management.component).then(m => m.ContactManagementComponent)` | Route loadComponent: () => import(./core/admin/contact-management/contact-management.component).then(m => m.ContactManagementComponent) |  |
| `runGuardsAndResolvers: always` | Route runGuardsAndResolvers: always |  |
| `` | title: 'Accueil - Collectif Ladyland' | ./pages/home/home.component |
| `]` | Route ] |  |
| `}` | Route } |  |
| `about` | title: 'À propos - Collectif Ladyland' | ./pages/about/about.component |
| `loadComponent: () => import(./pages/about/about.component).then(m => m.AboutComponent)` | Route loadComponent: () => import(./pages/about/about.component).then(m => m.AboutComponent) |  |
| `title: À propos - Collectif Ladyland` | Route title: À propos - Collectif Ladyland |  |
| `concerts` | title: 'Concerts - Collectif Ladyland' | ./core/admin/concert-management/concert-management.component |
| `loadComponent: () => import(./pages/concerts/concerts.component).then(m => m.ConcertsComponent)` | Route loadComponent: () => import(./pages/concerts/concerts.component).then(m => m.ConcertsComponent) |  |
| `title: Concerts - Collectif Ladyland` | Route title: Concerts - Collectif Ladyland |  |
| `gallery` | title: 'Galerie - Collectif Ladyland' | ./pages/gallery/gallery.component |
| `loadComponent: () => import(./pages/gallery/gallery.component).then(m => m.GalleryComponent)` | Route loadComponent: () => import(./pages/gallery/gallery.component).then(m => m.GalleryComponent) |  |
| `title: Galerie - Collectif Ladyland` | Route title: Galerie - Collectif Ladyland |  |
| `contact` | title: 'Contact - Collectif Ladyland' | ./pages/contact/contact.component |
| `loadComponent: () => import(./pages/contact/contact.component).then(m => m.ContactComponent)` | Route loadComponent: () => import(./pages/contact/contact.component).then(m => m.ContactComponent) |  |
| `title: Contact - Collectif Ladyland` | Route title: Contact - Collectif Ladyland |  |
| `**` | Route ** |  |
| `redirectTo: ` | Route redirectTo:  |  |
| `}` | Route } |  |

## Composants

| Nom | Type | Chemin |
| --- | --- | --- |
| app-root | Composant | src/app/app.component.ts |
| app-artist-management | Composant | src/app/core/admin/artist-management/artist-management.component.ts |
| app-concert-management | Composant | src/app/core/admin/concert-management/concert-management.component.ts |
| app-contact-management | Composant | src/app/core/admin/contact-management/contact-management.component.ts |
| app-dashboard | Composant | src/app/core/admin/dashboard/dashboard.component.ts |
| app-login | Composant | src/app/core/admin/login/login.component.ts |
| app-media-management | Composant | src/app/core/admin/media-management/media-management.component.ts |
| app-footer | Composant | src/app/core/footer/footer.component.ts |
| app-header | Composant | src/app/core/header/header.component.ts |
| app-about | Page | src/app/pages/about/about.component.ts |
| app-concerts | Page | src/app/pages/concerts/concerts.component.ts |
| app-contact | Page | src/app/pages/contact/contact.component.ts |
| app-gallery | Page | src/app/pages/gallery/gallery.component.ts |
| app-home | Page | src/app/pages/home/home.component.ts |

## Services

| Nom | Chemin |
| --- | --- |
| UauthService | src/app/core/admin/auth.service.ts |
| UdashboardUdataService | src/app/core/admin/dashboard/service/dashboard-data.service.ts |
| UapiService | src/app/services/api/api.service.ts |
| UgalleryService | src/app/services/gallery/gallery.service.ts |
| UsnackbarService | src/app/services/snackbar/snackbar.service.ts |

## Modèles

| Nom | Type | Chemin |
| --- | --- | --- |
| export interface Artist { | export interface Artist { | src/app/models/artist.model.ts |
| export interface Concert { | export interface Concert { | src/app/models/concert.model.ts |
| export interface ContactForm { | export interface ContactForm { | src/app/models/contact.model.ts |
| export interface ContactResponse { | export interface ContactResponse { | src/app/models/contact.model.ts |
| export enum MediaType { | export enum MediaType { | src/app/models/media.model.ts |
| export interface Media { | export interface Media { | src/app/models/media.model.ts |

## Installation

```bash
npm install
```

## Développement

Pour démarrer le serveur de développement :

```bash
ng serve
```

Naviguez vers `http://localhost:4200/`. L'application se rechargera automatiquement si vous modifiez l'un des fichiers source.

## Build

Pour construire le projet :

```bash
ng build
```

Les artefacts de construction seront stockés dans le répertoire `dist/`.

## Tests

Pour exécuter les tests unitaires :

```bash
ng test
```

## Aide supplémentaire

Pour obtenir plus d'aide sur Angular CLI, utilisez `ng help` ou consultez [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
