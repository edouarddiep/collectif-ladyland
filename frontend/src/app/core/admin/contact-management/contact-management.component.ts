import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import {DashboardDataService} from '../dashboard/service/dashboard-data.service';

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: Date;
  read: boolean;
}

@Component({
  selector: 'app-contact-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-management.component.html',
  styleUrls: ['./contact-management.component.scss']
})
export class ContactManagementComponent implements OnInit, OnDestroy {
  messages: Contact[] = [];
  selectedMessage: Contact | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private dashboardDataService: DashboardDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMessages();

    // S'abonner au service pour recharger les données quand nécessaire
    this.dashboardDataService.reloadData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadMessages();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMessages(): void {
    this.http.get<Contact[]>('http://localhost:3000/api/contact')
      .subscribe({
        next: data => {
          this.messages = data;
          // Forcer la détection de changement après mise à jour des données
          this.cdr.detectChanges();
        },
        error: error => {
          console.error('Error loading messages:', error);
        }
      });
  }

  viewMessage(message: Contact): void {
    this.selectedMessage = message;

    // Si le message n'a pas déjà été lu, le marquer comme lu
    if (!message.read) {
      this.markAsRead(message.id);
    }
  }

  markAsRead(id: number): void {
    this.http.patch<Contact>(`http://localhost:3000/api/contact/${id}/read`, {})
      .subscribe({
        next: () => {
          // Mettre à jour le statut du message localement
          if (this.selectedMessage && this.selectedMessage.id === id) {
            this.selectedMessage.read = true;
          }

          // Mettre à jour le message dans la liste
          const messageIndex = this.messages.findIndex(m => m.id === id);
          if (messageIndex !== -1) {
            this.messages[messageIndex].read = true;
            this.cdr.detectChanges();
          }
        },
        error: error => {
          console.error('Error marking message as read:', error);
        }
      });
  }

  deleteMessage(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      this.http.delete(`http://localhost:3000/api/contact/${id}`)
        .subscribe({
          next: () => {
            // Fermer le modal si le message sélectionné est celui qui est supprimé
            if (this.selectedMessage && this.selectedMessage.id === id) {
              this.closeModal();
            }

            // Recharger la liste des messages
            this.loadMessages();
            // Déclencher un rechargement global des données
            this.dashboardDataService.triggerReload();
          },
          error: error => {
            console.error('Error deleting message:', error);
          }
        });
    }
  }

  closeModal(): void {
    this.selectedMessage = null;
  }
}
