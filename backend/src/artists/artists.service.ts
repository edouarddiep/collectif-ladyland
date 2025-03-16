import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../config/firebase-config';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './schemas/artist.schema';
import { UpdateArtistDto } from "./dto/upload-artist.dto";

@Injectable()
export class ArtistsService {
  private readonly collection = 'artists';

  constructor(private firebaseService: FirebaseService) {}

// Dans artists.service.ts, pour la méthode update
  async update(id: number, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const db = this.firebaseService.getFirestore();
    const artistRef = db.collection(this.collection).doc(id.toString());
    const artistDoc = await artistRef.get();

    if (!artistDoc.exists) {
      throw new NotFoundException(`Artiste avec l'ID ${id} non trouvé`);
    }

    // Récupérer les données existantes
    const existingData = artistDoc.data() || {};

    // Convertir le DTO en objet JavaScript simple
    const updateData = JSON.parse(JSON.stringify(updateArtistDto));

    // Créer un objet de mise à jour sécurisé
    const updatedArtistData = {
      ...existingData,
      ...updateData,
      id: existingData.id  // Conserver l'ID original
    };

    // Mettre à jour dans Firestore
    await artistRef.update(updatedArtistData);

    return updatedArtistData as Artist;
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