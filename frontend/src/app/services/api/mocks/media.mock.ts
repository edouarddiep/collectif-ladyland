import { Media, MediaType } from '../../../models/media.model';

export const MEDIA_MOCK: Media[] = [
  {
    id: 1,
    title: 'Concert au New Morning',
    description: 'Extrait de notre concert au New Morning en novembre dernier',
    type: MediaType.VIDEO,
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: '/assets/images/gallery/new-morning-thumb.jpg',
    uploadDate: new Date('2024-11-15'),
    featured: true,
    sortOrder: 1
  },
  {
    id: 2,
    title: 'Nouveau single "Horizons"',
    description: 'Notre dernier single sorti le mois dernier',
    type: MediaType.AUDIO,
    url: 'https://soundcloud.com/collectifladyland/horizons',
    thumbnailUrl: '/assets/images/gallery/single-horizons-thumb.jpg',
    uploadDate: new Date('2024-12-05'),
    featured: true,
    sortOrder: 2
  },
  {
    id: 3,
    title: 'Session studio "Endless Wave"',
    description: 'Enregistrement de notre morceau Endless Wave aux studios de la Seine',
    type: MediaType.VIDEO,
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: '/assets/images/gallery/studio-session-thumb.jpg',
    uploadDate: new Date('2024-10-22'),
    featured: false,
    sortOrder: 3
  },
  {
    id: 4,
    title: 'Festival Jazz à Vienne',
    description: 'Photos de notre passage au Festival Jazz à Vienne',
    type: MediaType.PHOTO,
    url: '/assets/images/gallery/jazz-vienne-1.jpg',
    thumbnailUrl: '/assets/images/gallery/jazz-vienne-thumb.jpg',
    uploadDate: new Date('2024-07-10'),
    featured: true,
    sortOrder: 4
  },
  {
    id: 5,
    title: 'Répétition avant tournée',
    description: 'Séance de répétition au studio avant notre tournée d\'automne',
    type: MediaType.PHOTO,
    url: '/assets/images/gallery/rehearsal-1.jpg',
    thumbnailUrl: '/assets/images/gallery/rehearsal-thumb.jpg',
    uploadDate: new Date('2024-09-05'),
    featured: false,
    sortOrder: 5
  },
  {
    id: 6,
    title: 'Interview Radio Nova',
    description: 'Notre passage sur Radio Nova pour parler de notre nouvel EP',
    type: MediaType.AUDIO,
    url: 'https://soundcloud.com/collectifladyland/interview-nova',
    thumbnailUrl: '/assets/images/gallery/radio-nova-thumb.jpg',
    uploadDate: new Date('2024-11-28'),
    featured: false,
    sortOrder: 6
  },
  {
    id: 7,
    title: 'EP "Urban Tales" (2023)',
    description: 'Notre EP sorti en 2023',
    type: MediaType.AUDIO,
    url: 'https://open.spotify.com/album/collectifladyland/urbantales',
    thumbnailUrl: '/assets/images/gallery/ep-urban-tales-thumb.jpg',
    uploadDate: new Date('2023-05-15'),
    featured: true,
    sortOrder: 7
  },
  {
    id: 8,
    title: 'Backstage à La Bellevilloise',
    description: 'Photos en backstage avant notre concert à La Bellevilloise',
    type: MediaType.PHOTO,
    url: '/assets/images/gallery/backstage-bellevilloise.jpg',
    thumbnailUrl: '/assets/images/gallery/backstage-bellevilloise-thumb.jpg',
    uploadDate: new Date('2024-08-12'),
    featured: false,
    sortOrder: 8
  }
];
