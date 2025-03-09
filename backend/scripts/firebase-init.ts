import * as admin from 'firebase-admin';
import { config } from 'dotenv';
import * as process from 'process';

// Charger les variables d'environnement
config();

// Initialisation de Firebase Admin
const app = admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
            ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            : undefined,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();

// Données initiales d'artistes
const artists = [
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

// Fonctions utilitaires pour les dates
const today = new Date();
const formatDate = (date: Date): string => date.toISOString();

const futureDate = (daysFromNow: number): string => {
    const date = new Date();
    date.setDate(today.getDate() + daysFromNow);
    return formatDate(date);
};

const pastDate = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(today.getDate() - daysAgo);
    return formatDate(date);
};

// Données initiales de concerts
const concerts = [
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

// Données initiales de médias
const media = [
    {
        id: 1,
        title: 'Concert au New Morning',
        description: 'Extrait de notre concert au New Morning en novembre dernier',
        type: 'video',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: '/assets/images/gallery/new-morning-thumb.jpg',
        uploadDate: pastDate(120),
        featured: true,
        sortOrder: 1
    },
    {
        id: 2,
        title: 'Nouveau single "Horizons"',
        description: 'Notre dernier single sorti le mois dernier',
        type: 'audio',
        url: 'https://soundcloud.com/collectifladyland/horizons',
        thumbnailUrl: '/assets/images/gallery/single-horizons-thumb.jpg',
        uploadDate: pastDate(30),
        featured: true,
        sortOrder: 2
    },
    {
        id: 3,
        title: 'Session studio "Endless Wave"',
        description: 'Enregistrement de notre morceau Endless Wave aux studios de la Seine',
        type: 'video',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: '/assets/images/gallery/studio-session-thumb.jpg',
        uploadDate: pastDate(60),
        featured: false,
        sortOrder: 3
    },
    {
        id: 4,
        title: 'Festival Jazz à Vienne',
        description: 'Photos de notre passage au Festival Jazz à Vienne',
        type: 'photo',
        url: '/assets/images/gallery/jazz-vienne-1.jpg',
        thumbnailUrl: '/assets/images/gallery/jazz-vienne-thumb.jpg',
        uploadDate: pastDate(180),
        featured: true,
        sortOrder: 4
    },
    {
        id: 5,
        title: 'Répétition avant tournée',
        description: 'Séance de répétition au studio avant notre tournée d\'automne',
        type: 'photo',
        url: '/assets/images/gallery/rehearsal-1.jpg',
        thumbnailUrl: '/assets/images/gallery/rehearsal-thumb.jpg',
        uploadDate: pastDate(150),
        featured: false,
        sortOrder: 5
    },
    {
        id: 6,
        title: 'Interview Radio Nova',
        description: 'Notre passage sur Radio Nova pour parler de notre nouvel EP',
        type: 'audio',
        url: 'https://soundcloud.com/collectifladyland/interview-nova',
        thumbnailUrl: '/assets/images/gallery/radio-nova-thumb.jpg',
        uploadDate: pastDate(45),
        featured: false,
        sortOrder: 6
    },
    {
        id: 7,
        title: 'EP "Urban Tales" (2023)',
        description: 'Notre EP sorti en 2023',
        type: 'audio',
        url: 'https://open.spotify.com/album/collectifladyland/urbantales',
        thumbnailUrl: '/assets/images/gallery/ep-urban-tales-thumb.jpg',
        uploadDate: pastDate(300),
        featured: true,
        sortOrder: 7
    },
    {
        id: 8,
        title: 'Backstage à La Bellevilloise',
        description: 'Photos en backstage avant notre concert à La Bellevilloise',
        type: 'photo',
        url: '/assets/images/gallery/backstage-bellevilloise.jpg',
        thumbnailUrl: '/assets/images/gallery/backstage-bellevilloise-thumb.jpg',
        uploadDate: pastDate(200),
        featured: false,
        sortOrder: 8
    }
];

// Messages de contact initiaux
const contactMessages = [
    {
        id: 1,
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        subject: 'Demande de réservation',
        message: 'Bonjour, je représente le Festival Jazz en Ville et nous serions intéressés pour vous programmer en juillet prochain. Pouvez-vous me contacter pour en discuter ?',
        date: pastDate(15),
        read: true
    },
    {
        id: 2,
        name: 'Marie Martin',
        email: 'marie.martin@example.com',
        subject: 'Collaboration musicale',
        message: 'Je suis chanteuse et compositrice, et j\'aimerais beaucoup collaborer avec vous sur un projet. J\'adore votre univers musical. Serait-il possible d\'échanger à ce sujet ?',
        date: pastDate(7),
        read: false
    },
    {
        id: 3,
        name: 'Philippe Legrand',
        email: 'philippe.legrand@example.com',
        subject: 'Information concert',
        message: 'Bonjour, je souhaiterais savoir si vous prévoyez de jouer à Bordeaux prochainement ? Je suis un grand fan et j\'aimerais vous voir en concert.',
        date: pastDate(2),
        read: false
    }
];

/**
 * Crée un utilisateur administrateur dans Firebase Auth
 */
async function createFirebaseUser() {
    try {
        // Tenter de récupérer l'utilisateur existant
        try {
            const existingUser = await admin.auth().getUserByEmail('admin@collectifladyland.com');
            console.log('User already exists:', existingUser.uid);

            // S'assurer que l'utilisateur a les bons claims
            await admin.auth().setCustomUserClaims(existingUser.uid, { admin: true });
            console.log('Admin claims updated');

            return existingUser;
        } catch (error) {
            // Si l'utilisateur n'existe pas, le créer
            if (error.code === 'auth/user-not-found') {
                const userRecord = await admin.auth().createUser({
                    email: 'admin@collectifladyland.com',
                    password: 'admin123',
                    displayName: 'Admin Collectif',
                });

                console.log('User created:', userRecord.uid);

                // Définir des claims pour l'utilisateur admin
                await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
                console.log('Admin claims set');

                return userRecord;
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('Error creating/getting user:', error);
        throw error;
    }
}

/**
 * Initialise ou met à jour une collection Firestore avec des données
 */
async function initializeCollection(collectionName: string, data: any[]) {
    const collectionRef = db.collection(collectionName);

    console.log(`Initializing ${collectionName} collection...`);

    // Vérifier si la collection est vide
    const snapshot = await collectionRef.limit(1).get();
    const collectionExists = !snapshot.empty;

    // Si la collection existe, demander confirmation pour l'écrasement
    if (collectionExists) {
        console.log(`⚠️ Collection ${collectionName} already exists.`);
        // En mode script, nous procédons à la mise à jour sans demander de confirmation
        console.log(`🔄 Updating ${collectionName} collection...`);
    }

    // Batch write pour les performances
    const batches = [];
    const batchSize = 500; // Firestore limite à 500 opérations par batch

    for (let i = 0; i < data.length; i += batchSize) {
        const batch = db.batch();
        const batchData = data.slice(i, i + batchSize);

        for (const item of batchData) {
            const docRef = collectionRef.doc(item.id.toString());
            batch.set(docRef, item);
        }

        batches.push(batch.commit());
    }

    await Promise.all(batches);
    console.log(`✅ ${data.length} ${collectionName} items initialized/updated successfully`);
}

/**
 * Fonction principale d'initialisation
 */
async function initializeFirebase() {
    try {
        console.log('🚀 Starting Firebase initialization...');

        // Créer l'utilisateur admin
        const user = await createFirebaseUser();
        console.log(`✅ Admin user setup complete (ID: ${user.uid})`);

        // Initialiser les collections
        await initializeCollection('artists', artists);
        await initializeCollection('concerts', concerts);
        await initializeCollection('media', media);
        await initializeCollection('contact_messages', contactMessages);

        console.log('✅ Firebase initialization completed successfully!');

    } catch (error) {
        console.error('❌ Error initializing Firebase:', error);
        process.exit(1);
    } finally {
        // Fermer la connexion Firebase
        await app.delete();
    }
}

// Exécuter l'initialisation
initializeFirebase();