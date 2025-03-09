# Backend Collectif Ladyland

API backend NestJS pour le site du Collectif Ladyland - groupe de musique basé à Paris.

## Technologies utilisées

- **[NestJS](https://nestjs.com/)** - Framework Node.js progressif pour construire des applications backend efficaces et évolutives
- **[Firebase](https://firebase.google.com/)** - Base de données Firestore et authentification
- **[TypeScript](https://www.typescriptlang.org/)** - Langage typé au-dessus de JavaScript
- **[Multer](https://github.com/expressjs/multer)** - Middleware pour la gestion des fichiers uploadés
- **[JWT](https://jwt.io/)** - JSON Web Tokens pour l'authentification

## Prérequis

- Node.js (v18.x ou supérieur)
- npm ou yarn
- Un projet Firebase (avec Firestore et Authentication activés)

## Installation

1. Cloner le dépôt :
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Configurer les variables d'environnement :
    - Copiez le fichier `.env.example` vers `.env`
    - Remplissez les informations Firebase et autres paramètres
   ```bash
   cp .env.example .env
   ```

## Configuration Firebase

1. Créez un projet Firebase sur [Firebase Console](https://console.firebase.google.com/)
2. Activez Firestore et Authentication
3. Dans les paramètres du projet > Comptes de service > Générer une nouvelle clé privée
4. Utilisez les informations de ce fichier JSON pour remplir les variables d'environnement :
    - `FIREBASE_PROJECT_ID`
    - `FIREBASE_PRIVATE_KEY`
    - `FIREBASE_CLIENT_EMAIL`
    - `FIREBASE_DATABASE_URL`

## Initialisation de la base de données

Pour initialiser la base de données avec des données de test :

```bash
npm run firebase:init
```

Cette commande va créer :
- Un utilisateur administrateur (email: admin@collectifladyland.com, password: admin123)
- Des artistes
- Des concerts à venir et passés
- Des médias (photos, vidéos, audio)

## Démarrage du serveur

```bash
# Développement
npm run start:dev

# Production
npm run start:prod
```

Le serveur sera accessible sur http://localhost:3000/api/

## Endpoints API

### Authentification
- `POST /api/auth/login` - Connexion administrateur
- `GET /api/auth/profile` - Profil utilisateur connecté (protégé)

### Artistes
- `GET /api/artists` - Liste des artistes
- `GET /api/artists/:id` - Détails d'un artiste
- `POST /api/artists` - Créer un artiste (protégé)
- `PUT /api/artists/:id` - Modifier un artiste (protégé)
- `DELETE /api/artists/:id` - Supprimer un artiste (protégé)

### Concerts
- `GET /api/concerts` - Liste des concerts
- `GET /api/concerts/upcoming` - Concerts à venir
- `GET /api/concerts/past` - Concerts passés
- `GET /api/concerts/:id` - Détails d'un concert
- `POST /api/concerts` - Créer un concert (protégé)
- `PUT /api/concerts/:id` - Modifier un concert (protégé)
- `DELETE /api/concerts/:id` - Supprimer un concert (protégé)

### Média
- `GET /api/media` - Liste des médias
- `GET /api/media/featured` - Médias à la une
- `GET /api/media/type?type=photo` - Médias par type (photo, video, audio)
- `GET /api/media/:id` - Détails d'un média
- `POST /api/media` - Créer un média (protégé)
- `PUT /api/media/:id` - Modifier un média (protégé)
- `DELETE /api/media/:id` - Supprimer un média (protégé)

### Contact
- `POST /api/contact` - Envoyer un message
- `GET /api/contact` - Liste des messages (protégé)
- `GET /api/contact/:id` - Détails d'un message (protégé)
- `PATCH /api/contact/:id/read` - Marquer un message comme lu (protégé)
- `DELETE /api/contact/:id` - Supprimer un message (protégé)

### Upload
- `POST /api/upload/image` - Télécharger une image (protégé)
- `POST /api/upload/video` - Télécharger une vidéo (protégé)
- `POST /api/upload/audio` - Télécharger un fichier audio (protégé)

## Intégration avec le frontend Angular

Ce backend est conçu pour fonctionner avec le frontend Angular existant. Assurez-vous que le frontend est configuré pour pointer vers l'URL de base de l'API (http://localhost:3000/api/).

## CORS

Le CORS est configuré pour autoriser les requêtes de n'importe quelle origine en mode développement. Pour la production, il est recommandé de restreindre les origines autorisées en modifiant le fichier `src/main.ts`.

## Licence

MIT