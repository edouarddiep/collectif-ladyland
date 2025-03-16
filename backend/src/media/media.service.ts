import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../config/firebase-config';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media, MediaType } from './schemas/media.schema';

@Injectable()
export class MediaService {
  private readonly collection = 'media';

  constructor(private firebaseService: FirebaseService) {}

  async create(createMediaDto: CreateMediaDto): Promise<Media> {
    const db = this.firebaseService.getFirestore();

    // Récupérer le dernier ID pour auto-incrémenter
    const mediaRef = db.collection(this.collection);
    const snapshot = await mediaRef.orderBy('id', 'desc').limit(1).get();

    let nextId = 1;
    if (!snapshot.empty) {
      const lastMedia = snapshot.docs[0].data() as Media;
      nextId = lastMedia.id + 1;
    }

    // Gérer le cas où il n'y a pas de titre
    if (!createMediaDto.title || createMediaDto.title.trim() === '') {
      // Générer un titre par défaut basé sur le type
      switch (createMediaDto.type) {
        case MediaType.PHOTO:
          createMediaDto.title = `Photo ${nextId}`;
          break;
        case MediaType.VIDEO:
          createMediaDto.title = `Vidéo ${nextId}`;
          break;
        case MediaType.AUDIO:
          createMediaDto.title = `Audio ${nextId}`;
          break;
        default:
          createMediaDto.title = `Média ${nextId}`;
      }
    }

    // Pour les photos, si aucune miniature n'est fournie, utiliser l'URL principale
    if (createMediaDto.type === MediaType.PHOTO && !createMediaDto.thumbnailUrl && createMediaDto.url) {
      createMediaDto.thumbnailUrl = createMediaDto.url;
    }

    // Créer le nouveau média
    const newMedia: Media = {
      id: nextId,
      uploadDate: new Date().toISOString(),
      ...createMediaDto
    };

    // Convertir l'objet en format compatible avec Firestore
    const mediaData = {
      id: newMedia.id,
      title: newMedia.title || '',
      description: newMedia.description || '',
      type: newMedia.type,
      url: newMedia.url || '',
      thumbnailUrl: newMedia.thumbnailUrl || '',
      uploadDate: newMedia.uploadDate,
      featured: newMedia.featured || false,
      sortOrder: newMedia.sortOrder || 0
    };

    // Sauvegarder dans Firestore
    await mediaRef.doc(nextId.toString()).set(mediaData);

    return newMedia;
  }

  async findAll(): Promise<Media[]> {
    const db = this.firebaseService.getFirestore();
    const mediaRef = db.collection(this.collection);
    const snapshot = await mediaRef.orderBy('sortOrder', 'asc').get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => {
      const media = doc.data() as Media;

      // Assurer que les photos ont une miniature (utiliser l'URL principale si nécessaire)
      if (media.type === MediaType.PHOTO && !media.thumbnailUrl && media.url) {
        media.thumbnailUrl = media.url;
      }

      return media;
    });
  }

  async findFeatured(): Promise<Media[]> {
    const db = this.firebaseService.getFirestore();
    const mediaRef = db.collection(this.collection);

    const snapshot = await mediaRef
        .where('featured', '==', true)
        .orderBy('sortOrder', 'asc')
        .get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => {
      const media = doc.data() as Media;

      // Assurer que les photos ont une miniature (utiliser l'URL principale si nécessaire)
      if (media.type === MediaType.PHOTO && !media.thumbnailUrl && media.url) {
        media.thumbnailUrl = media.url;
      }

      return media;
    });
  }

  async findByType(type: MediaType): Promise<Media[]> {
    const db = this.firebaseService.getFirestore();
    const mediaRef = db.collection(this.collection);

    const snapshot = await mediaRef
        .where('type', '==', type)
        .orderBy('sortOrder', 'asc')
        .get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => {
      const media = doc.data() as Media;

      // Assurer que les photos ont une miniature (utiliser l'URL principale si nécessaire)
      if (media.type === MediaType.PHOTO && !media.thumbnailUrl && media.url) {
        media.thumbnailUrl = media.url;
      }

      return media;
    });
  }

  async findOne(id: number): Promise<Media> {
    const db = this.firebaseService.getFirestore();
    const mediaDoc = await db.collection(this.collection).doc(id.toString()).get();

    if (!mediaDoc.exists) {
      throw new NotFoundException(`Média avec l'ID ${id} non trouvé`);
    }

    const media = mediaDoc.data() as Media;

    // Assurer que les photos ont une miniature (utiliser l'URL principale si nécessaire)
    if (media.type === MediaType.PHOTO && !media.thumbnailUrl && media.url) {
      media.thumbnailUrl = media.url;
    }

    return media;
  }

  async update(id: number, updateMediaDto: UpdateMediaDto): Promise<Media> {
    const db = this.firebaseService.getFirestore();
    const mediaRef = db.collection(this.collection).doc(id.toString());
    const mediaDoc = await mediaRef.get();

    if (!mediaDoc.exists) {
      throw new NotFoundException(`Média avec l'ID ${id} non trouvé`);
    }

    // Récupérer les données existantes
    const existingData = mediaDoc.data() as Media;

    // Pour les photos, si aucune miniature n'est fournie, utiliser l'URL principale
    if (updateMediaDto.type === MediaType.PHOTO && !updateMediaDto.thumbnailUrl && updateMediaDto.url) {
      updateMediaDto.thumbnailUrl = updateMediaDto.url;
    }

    // Créer un objet de mise à jour sécurisé
    const safeUpdateData = {
      id: existingData.id,
      title: updateMediaDto.title || existingData.title || '',
      description: updateMediaDto.description || existingData.description || '',
      type: updateMediaDto.type || existingData.type,
      url: updateMediaDto.url || existingData.url || '',
      thumbnailUrl: updateMediaDto.thumbnailUrl || existingData.thumbnailUrl || '',
      uploadDate: existingData.uploadDate, // Ne pas mettre à jour la date d'origine
      featured: updateMediaDto.featured ?? existingData.featured,
      sortOrder: updateMediaDto.sortOrder ?? existingData.sortOrder
    };

    // Assurer que les photos ont une miniature (utiliser l'URL principale si nécessaire)
    if (safeUpdateData.type === MediaType.PHOTO && !safeUpdateData.thumbnailUrl && safeUpdateData.url) {
      safeUpdateData.thumbnailUrl = safeUpdateData.url;
    }

    await mediaRef.update(safeUpdateData);

    return safeUpdateData as Media;
  }

  async remove(id: number): Promise<void> {
    const db = this.firebaseService.getFirestore();
    const mediaRef = db.collection(this.collection).doc(id.toString());
    const mediaDoc = await mediaRef.get();

    if (!mediaDoc.exists) {
      throw new NotFoundException(`Média avec l'ID ${id} non trouvé`);
    }

    await mediaRef.delete();
  }
}