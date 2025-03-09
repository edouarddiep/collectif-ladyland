import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../config/firebase-config';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './schemas/artist.schema';
import { UpdateArtistDto } from "./dto/upload-artist.dto";

@Injectable()
export class ArtistsService {
  private readonly collection = 'artists';

  constructor(private firebaseService: FirebaseService) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const db = this.firebaseService.getFirestore();

    // Récupérer le dernier ID pour auto-incrémenter
    const artistsRef = db.collection(this.collection);
    const snapshot = await artistsRef.orderBy('id', 'desc').limit(1).get();

    let nextId = 1;
    if (!snapshot.empty) {
      const lastArtist = snapshot.docs[0].data() as Artist;
      nextId = lastArtist.id + 1;
    }

    // Créer le nouvel artiste
    const newArtist = {
      id: nextId,
      ...createArtistDto
    } as Artist;

    // Convertir l'objet en format compatible avec Firestore
    const artistData = {
      id: newArtist.id,
      name: newArtist.name,
      role: newArtist.role,
      bio: newArtist.bio,
      photoUrl: newArtist.photoUrl || '',
      socialLinks: newArtist.socialLinks || {}
    };

    // Sauvegarder dans Firestore
    await artistsRef.doc(nextId.toString()).set(artistData);

    return newArtist;
  }

  async findAll(): Promise<Artist[]> {
    const db = this.firebaseService.getFirestore();
    const artistsRef = db.collection(this.collection);
    const snapshot = await artistsRef.orderBy('id', 'asc').get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => doc.data() as Artist);
  }

  async findOne(id: number): Promise<Artist> {
    const db = this.firebaseService.getFirestore();
    const artistDoc = await db.collection(this.collection).doc(id.toString()).get();

    if (!artistDoc.exists) {
      throw new NotFoundException(`Artiste avec l'ID ${id} non trouvé`);
    }

    return artistDoc.data() as Artist;
  }

  async update(id: number, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const db = this.firebaseService.getFirestore();
    const artistRef = db.collection(this.collection).doc(id.toString());
    const artistDoc = await artistRef.get();

    if (!artistDoc.exists) {
      throw new NotFoundException(`Artiste avec l'ID ${id} non trouvé`);
    }

    // Récupérer les données existantes
    const existingData = artistDoc.data() || {};

    // Créer un objet de mise à jour sécurisé
    const updatedArtistData = {
      id: existingData.id,
      name: updateArtistDto.name || existingData.name,
      role: updateArtistDto.role || existingData.role,
      bio: updateArtistDto.bio || existingData.bio,
      photoUrl: updateArtistDto.photoUrl || existingData.photoUrl || '',
      socialLinks: updateArtistDto.socialLinks || existingData.socialLinks || {}
    };

    // Mettre à jour dans Firestore
    await artistRef.update(updatedArtistData);

    return updatedArtistData as Artist;
  }

  async remove(id: number): Promise<void> {
    const db = this.firebaseService.getFirestore();
    const artistRef = db.collection(this.collection).doc(id.toString());
    const artistDoc = await artistRef.get();

    if (!artistDoc.exists) {
      throw new NotFoundException(`Artiste avec l'ID ${id} non trouvé`);
    }

    await artistRef.delete();
  }
}