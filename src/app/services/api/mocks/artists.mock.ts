import { Artist } from '../../../models/artist.model';

export const ARTISTS_MOCK: Artist[] = [
  {
    id: 1,
    name: 'Emma Laurent',
    role: 'Chanteuse / Guitariste',
    bio: 'Fondatrice du Collectif Ladyland, Emma est une artiste polyvalente avec une voix puissante et une présence scénique captivante. Formée au conservatoire de Paris, elle a développé un style unique qui fusionne influences jazz, soul et rock indépendant. Sa philosophie musicale s\'articule autour de l\'idée que la musique doit avant tout raconter une histoire authentique.',
    photoUrl: '/assets/images/artists/emma-laurent.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/emmalaurent',
      facebook: 'https://www.facebook.com/emmalaurent',
      soundcloud: 'https://soundcloud.com/emmalaurent'
    }
  },
  {
    id: 2,
    name: 'Thomas Mercier',
    role: 'Bassiste',
    bio: 'Avec une technique impeccable et un groove distinctif, Thomas apporte la fondation rythmique essentielle au son du Collectif Ladyland. Son parcours musical a débuté avec le jazz avant de s\'étendre au funk et aux musiques électroniques. Sa basse est le pilier sur lequel s\'appuient les compositions du groupe, mêlant profondeur et précision.',
    photoUrl: '/assets/images/artists/thomas-mercier.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/thomasmercier',
      facebook: 'https://www.facebook.com/thomasmercier'
    }
  },
  {
    id: 3,
    name: 'Léa Dubois',
    role: 'Claviériste / Compositrice',
    bio: 'Virtuose des claviers et compositrice inventive, Léa enrichit le groupe avec des textures sonores sophistiquées et des harmonies complexes. Son background en musique classique et son intérêt pour la production électronique contemporaine créent un mélange unique qui définit en partie l\'identité sonore du Collectif Ladyland. Elle est également impliquée dans la composition et les arrangements de la majorité des morceaux du groupe.',
    photoUrl: '/assets/images/artists/lea-dubois.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/leadubois',
      soundcloud: 'https://soundcloud.com/leadubois'
    }
  },
  {
    id: 4,
    name: 'Alex Moreau',
    role: 'Batteur / Percussionniste',
    bio: 'Le rythme incarné, Alex apporte énergie et précision à chaque performance du Collectif Ladyland. Son style de jeu, influencé par le jazz, l\'afrobeat et le rock progressif, crée un fondement dynamique qui anime les compositions du groupe. Éternel étudiant des traditions rythmiques du monde entier, il intègre constamment de nouvelles influences dans son jeu, gardant le son du collectif en évolution permanente.',
    photoUrl: '/assets/images/artists/alex-moreau.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/alexmoreau',
      youtube: 'https://www.youtube.com/alexmoreau'
    }
  }
];
