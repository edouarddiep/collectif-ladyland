import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Concert {
  id: number;
  title: string;
  date: string;
  venue: string;
  city: string;
  description: string;
  ticketLink?: string;
  imageUrl?: string;
  isFeatured: boolean;
}

@Component({
  selector: 'app-concert-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './concert-management.component.html',
  styleUrls: ['./concert-management.component.scss']
})
export class ConcertManagementComponent implements OnInit {
  concerts: Concert[] = [];
  concertForm!: FormGroup;
  selectedFile: File | null = null;
  currentImageUrl: string | null = null;
  editMode = false;
  editingId: number | null = null;
  showForm = false;
  isSubmitting = false;
  searchText = '';
  filteredConcerts: Concert[] = [];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadConcerts();
    this.initForm();
  }

  initForm(concert?: Concert): void {
    this.concertForm = this.fb.group({
      title: [concert?.title || '', [Validators.required]],
      date: [concert?.date ? new Date(concert.date).toISOString().substring(0, 10) : '', [Validators.required]],
      venue: [concert?.venue || '', [Validators.required]],
      city: [concert?.city || '', [Validators.required]],
      description: [concert?.description || '', [Validators.required]],
      ticketLink: [concert?.ticketLink || ''],
      isFeatured: [concert?.isFeatured || false]
    });

    if (concert?.imageUrl) {
      this.currentImageUrl = concert.imageUrl;
    } else {
      this.currentImageUrl = null;
    }
  }

  loadConcerts(): void {
    this.http.get<Concert[]>('http://localhost:3000/api/concerts')
      .subscribe(data => {
        this.concerts = data;
        this.filteredConcerts = [...this.concerts];
      });
  }

  showAddForm(): void {
    this.editMode = false;
    this.editingId = null;
    this.initForm();
    this.showForm = true;
  }

  editConcert(concert: Concert): void {
    this.editMode = true;
    this.editingId = concert.id;
    this.initForm(concert);
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.concertForm.invalid) {
      this.markFormGroupTouched(this.concertForm);
      return;
    }

    this.isSubmitting = true;
    const formData = this.concertForm.value;

    // Si un fichier a été sélectionné, téléchargez-le d'abord
    if (this.selectedFile) {
      const fileFormData = new FormData();
      fileFormData.append('file', this.selectedFile);

      this.http.post<any>('http://localhost:3000/api/upload/image', fileFormData)
        .subscribe({
          next: (fileResponse) => {
            // Ajoutez l'URL de l'image au formulaire
            formData.imageUrl = `http://localhost:3000${fileResponse.path}`;
            this.saveConcert(formData);
          },
          error: (error) => {
            console.error('Error uploading file:', error);
            this.isSubmitting = false;
          }
        });
    } else {
      // Si pas de nouveau fichier et en mode édition, conservez l'image existante
      if (this.editMode && this.currentImageUrl) {
        formData.imageUrl = this.currentImageUrl;
      }
      this.saveConcert(formData);
    }
  }

  saveConcert(formData: any): void {
    if (this.editMode && this.editingId) {
      this.http.put<Concert>(`http://localhost:3000/api/concerts/${this.editingId}`, formData)
        .subscribe({
          next: () => {
            this.isSubmitting = false;
            this.showForm = false;
            this.loadConcerts();
          },
          error: (error) => {
            console.error('Error updating concert:', error);
            this.isSubmitting = false;
          }
        });
    } else {
      this.http.post<Concert>('http://localhost:3000/api/concerts', formData)
        .subscribe({
          next: () => {
            this.isSubmitting = false;
            this.showForm = false;
            this.loadConcerts();
          },
          error: (error) => {
            console.error('Error creating concert:', error);
            this.isSubmitting = false;
          }
        });
    }
  }

  deleteConcert(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce concert ?')) {
      this.http.delete(`http://localhost:3000/api/concerts/${id}`)
        .subscribe({
          next: () => {
            this.loadConcerts();
          },
          error: (error) => {
            console.error('Error deleting concert:', error);
          }
        });
    }
  }

  filterConcerts(): void {
    if (!this.searchText) {
      this.filteredConcerts = [...this.concerts];
      return;
    }

    const search = this.searchText.toLowerCase();
    this.filteredConcerts = this.concerts.filter(concert =>
      concert.title.toLowerCase().includes(search) ||
      concert.venue.toLowerCase().includes(search) ||
      concert.city.toLowerCase().includes(search)
    );
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
