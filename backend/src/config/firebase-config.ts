import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
    private firebaseApp: admin.app.App;
    private db: admin.firestore.Firestore;

    constructor(private configService: ConfigService) {
        // Vérifie si Firebase est déjà initialisé pour éviter les initialisations multiples
        if (!admin.apps.length) {
            this.firebaseApp = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
                    privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY')
                        ? this.configService.get<string>('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n')
                        : undefined,
                    clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
                }),
                databaseURL: this.configService.get<string>('FIREBASE_DATABASE_URL'),
            });
        } else {
            this.firebaseApp = admin.app();
        }

        this.db = admin.firestore();
    }

    getFirebaseAdmin() {
        return admin;
    }

    getFirebaseApp() {
        return this.firebaseApp;
    }

    getFirestore() {
        return this.db;
    }

    // Méthode pour vérifier le token Firebase
    async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
        try {
            return await admin.auth().verifyIdToken(token);
        } catch (error) {
            throw new Error('Unauthorized - Invalid Firebase token');
        }
    }
}