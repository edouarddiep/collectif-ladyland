import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../config/firebase-config';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact, ContactResponse } from './schemas/contact.schema';

@Injectable()
export class ContactService {
  private readonly collection = 'contact_messages';

  constructor(private firebaseService: FirebaseService) {}

  async create(createContactDto: CreateContactDto): Promise<ContactResponse> {
    try {
      const db = this.firebaseService.getFirestore();

      // Récupérer le dernier ID pour auto-incrémenter
      const contactRef = db.collection(this.collection);
      const snapshot = await contactRef.orderBy('id', 'desc').limit(1).get();

      let nextId = 1;
      if (!snapshot.empty) {
        const lastContact = snapshot.docs[0].data() as Contact;
        nextId = lastContact.id + 1;
      }

      // Créer le nouveau message
      const newContact: Contact = {
        id: nextId,
        date: new Date().toISOString(),
        read: false,
        ...createContactDto
      };

      // Convertir l'objet en format compatible avec Firestore
      const contactData = {
        id: newContact.id,
        name: newContact.name,
        email: newContact.email,
        subject: newContact.subject,
        message: newContact.message,
        date: newContact.date,
        read: newContact.read
      };

      // Sauvegarder dans Firestore
      await contactRef.doc(nextId.toString()).set(contactData);

      return {
        success: true,
        message: 'Votre message a été envoyé avec succès. Nous vous contacterons bientôt!'
      };
    } catch (error) {
      console.error('Error submitting contact form:', error);
      return {
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.'
      };
    }
  }

  async findAll(): Promise<Contact[]> {
    const db = this.firebaseService.getFirestore();
    const contactRef = db.collection(this.collection);
    const snapshot = await contactRef.orderBy('date', 'desc').get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => doc.data() as Contact);
  }

  async findOne(id: number): Promise<Contact> {
    const db = this.firebaseService.getFirestore();
    const contactDoc = await db.collection(this.collection).doc(id.toString()).get();

    if (!contactDoc.exists) {
      throw new NotFoundException(`Message avec l'ID ${id} non trouvé`);
    }

    return contactDoc.data() as Contact;
  }

  async markAsRead(id: number): Promise<Contact> {
    const db = this.firebaseService.getFirestore();
    const contactRef = db.collection(this.collection).doc(id.toString());
    const contactDoc = await contactRef.get();

    if (!contactDoc.exists) {
      throw new NotFoundException(`Message avec l'ID ${id} non trouvé`);
    }

    // Convertir l'objet en format compatible avec Firestore
    const updatedContactData = {
      ...contactDoc.data(),
      read: true
    };

    await contactRef.update(updatedContactData);

    return updatedContactData as Contact;
  }

  async remove(id: number): Promise<void> {
    const db = this.firebaseService.getFirestore();
    const contactRef = db.collection(this.collection).doc(id.toString());
    const contactDoc = await contactRef.get();

    if (!contactDoc.exists) {
      throw new NotFoundException(`Message avec l'ID ${id} non trouvé`);
    }

    await contactRef.delete();
  }
}