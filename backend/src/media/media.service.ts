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

    // Créer le nouveau média
    const newMedia: Media = {
      id: nextId,
      uploadDate: new Date().toISOString(),
      ...createMediaDto
    };

    // Convertir l'objet en format compatible avec Firestore
    const mediaData = {
      id: newMedia.id,
      title: newMedia.title,
      description: newMedia.description || '',
      type: newMedia.type,
      url: newMedia.url,
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

    return snapshot.docs.map(doc => doc.data() as Media);
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

    return snapshot.docs.map(doc => doc.data() as Media);
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

    return snapshot.docs.map(doc => doc.data() as Media);
  }

  async findOne(id: number): Promise<Media> {
    const db = this.firebaseService.getFirestore();
    const mediaDoc = await db.collection(this.collection).doc(id.toString()).get();

    if (!mediaDoc.exists) {
      throw new NotFoundException(`Média avec l'ID ${id} non trouvé`);
    }

    return mediaDoc.data() as Media;
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

    // Créer un objet de mise à jour sécurisé
    const safeUpdateData = {
      id: existingData.id,
      title: updateMediaDto.title || existingData.title,
      description: updateMediaDto.description || existingData.description || '',
      type: updateMediaDto.type || existingData.type,
      url: updateMediaDto.url || existingData.url,
      thumbnailUrl: updateMediaDto.thumbnailUrl || existingData.thumbnailUrl || '',
      uploadDate: existingData.uploadDate, // Ne pas mettre à jour la date d'origine
      featured: updateMediaDto.featured ?? existingData.featured,
      sortOrder: updateMediaDto.sortOrder ?? existingData.sortOrder
    };

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