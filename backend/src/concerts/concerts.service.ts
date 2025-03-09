import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../config/firebase-config';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { Concert } from './schemas/concert.schema';

@Injectable()
export class ConcertsService {
    private readonly collection = 'concerts';

    constructor(private firebaseService: FirebaseService) {}

    async create(createConcertDto: CreateConcertDto): Promise<Concert> {
        const db = this.firebaseService.getFirestore();

        // Récupérer le dernier ID pour auto-incrémenter
        const concertsRef = db.collection(this.collection);
        const snapshot = await concertsRef.orderBy('id', 'desc').limit(1).get();

        let nextId = 1;
        if (!snapshot.empty) {
            const lastConcert = snapshot.docs[0].data() as Concert;
            nextId = lastConcert.id + 1;
        }

        // Créer le nouveau concert
        const newConcert: Concert = {
            id: nextId,
            ...createConcertDto
        };

        // Sauvegarder dans Firestore
        await concertsRef.doc(nextId.toString()).set(newConcert);

        return newConcert;
    }

    async findAll(): Promise<Concert[]> {
        const db = this.firebaseService.getFirestore();
        const concertsRef = db.collection(this.collection);
        const snapshot = await concertsRef.orderBy('date', 'desc').get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(doc => doc.data() as Concert);
    }

    async findUpcoming(): Promise<Concert[]> {
        const db = this.firebaseService.getFirestore();
        const concertsRef = db.collection(this.collection);
        const today = new Date().toISOString().substring(0, 10); // YYYY-MM-DD

        const snapshot = await concertsRef
            .where('date', '>=', today)
            .orderBy('date', 'asc')
            .get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(doc => doc.data() as Concert);
    }

    async findPast(): Promise<Concert[]> {
        const db = this.firebaseService.getFirestore();
        const concertsRef = db.collection(this.collection);
        const today = new Date().toISOString().substring(0, 10); // YYYY-MM-DD

        const snapshot = await concertsRef
            .where('date', '<', today)
            .orderBy('date', 'desc')
            .get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(doc => doc.data() as Concert);
    }

    async findOne(id: number): Promise<Concert> {
        const db = this.firebaseService.getFirestore();
        const concertDoc = await db.collection(this.collection).doc(id.toString()).get();

        if (!concertDoc.exists) {
            throw new NotFoundException(`Concert avec l'ID ${id} non trouvé`);
        }

        return concertDoc.data() as Concert;
    }

    async update(id: number, updateConcertDto: UpdateConcertDto): Promise<Concert> {
        const db = this.firebaseService.getFirestore();
        const concertRef = db.collection(this.collection).doc(id.toString());
        const concertDoc = await concertRef.get();

        if (!concertDoc.exists) {
            throw new NotFoundException(`Concert avec l'ID ${id} non trouvé`);
        }

        const updatedConcert = {
            ...concertDoc.data(),
            ...updateConcertDto
        };

        await concertRef.update(updatedConcert);

        return updatedConcert as Concert;
    }

    async remove(id: number): Promise<void> {
        const db = this.firebaseService.getFirestore();
        const concertRef = db.collection(this.collection).doc(id.toString());
        const concertDoc = await concertRef.get();

        if (!concertDoc.exists) {
            throw new NotFoundException(`Concert avec l'ID ${id} non trouvé`);
        }

        await concertRef.delete();
    }
}