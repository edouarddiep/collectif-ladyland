import { Concert } from '../../../models/concert.model';

// Utiliser des dates dynamiques pour que les concerts à venir restent pertinents
const today = new Date();
const futureDate = (daysFromNow: number): Date => {
  const date = new Date();
  date.setDate(today.getDate() + daysFromNow);
  return date;
};

const pastDate = (daysAgo: number): Date => {
  const date = new Date();
  date.setDate(today.getDate() - daysAgo);
  return date;
};

export const CONCERTS_MOCK: Concert[] = [
  {
    id: 1,
    title: 'Soirée Jazz au Sunset',
    date: futureDate(15),
    venue: 'Le Sunset',
    city: 'Paris',
    description: 'Le Collectif Ladyland présente son nouveau répertoire lors d\'une soirée jazz au célèbre club Le Sunset. Une occasion unique de découvrir nos nouvelles compositions dans une ambiance intimiste.',
    ticketLink: 'https://www.sunset-sunside.com/billeterie',
    imageUrl: '/assets/images/concerts/sunset.jpg',
    isFeatured: true
  },
  {
    id: 2,
    title: 'Festival Les Nuits Sonores',
    date: futureDate(45),
    venue: 'Les Subsistances',
    city: 'Lyon',
    description: 'Nous sommes ravis de vous annoncer notre participation au festival Les Nuits Sonores. Le Collectif Ladyland se produira sur la scène principale pour un concert exceptionnel mêlant jazz, électro et influences world.',
    ticketLink: 'https://www.nuits-sonores.com/billetterie',
    imageUrl: '/assets/images/concerts/nuits-sonores.jpg',
    isFeatured: true
  },
  {
    id: 3,
    title: 'Showcase à la FNAC',
    date: futureDate(10),
    venue: 'FNAC Forum des Halles',
    city: 'Paris',
    description: 'Showcase acoustique à la FNAC Forum des Halles pour présenter notre nouvel EP. Venez nous rencontrer et découvrir nos nouveaux morceaux dans une version intimiste.',
    ticketLink: '',
    imageUrl: '/assets/images/concerts/showcase-fnac.jpg',
    isFeatured: false
  },
  {
    id: 4,
    title: 'Concert au New Morning',
    date: pastDate(30),
    venue: 'New Morning',
    city: 'Paris',
    description: 'Le Collectif Ladyland était au New Morning pour une soirée mémorable! Merci à tous ceux qui étaient présents.',
    ticketLink: '',
    imageUrl: '/assets/images/concerts/new-morning.jpg',
    isFeatured: false
  },
  {
    id: 5,
    title: 'Festival Jazz à Vienne',
    date: pastDate(90),
    venue: 'Théâtre Antique',
    city: 'Vienne',
    description: 'Nous avons eu l\'honneur de nous produire au prestigieux festival Jazz à Vienne, partageant la scène avec des artistes internationaux.',
    ticketLink: '',
    imageUrl: '/assets/images/concerts/jazz-vienne.jpg',
    isFeatured: false
  },
  {
    id: 6,
    title: 'Collectif Ladyland + Invités',
    date: futureDate(75),
    venue: 'La Bellevilloise',
    city: 'Paris',
    description: 'Soirée spéciale à La Bellevilloise avec le Collectif Ladyland et plusieurs invités surprise. Une fusion de styles et de talents pour une expérience musicale unique.',
    ticketLink: 'https://www.labellevilloise.com/billetterie',
    imageUrl: '/assets/images/concerts/bellevilloise.jpg',
    isFeatured: true
  }
];
