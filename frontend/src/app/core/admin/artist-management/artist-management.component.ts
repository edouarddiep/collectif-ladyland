import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Artist {
  id: number;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    soundcloud?: string;
  };
}

@Component({
  selector: 'app-artist-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './artist-management.component.html',
  styleUrls: ['./artist-management.component.scss']
})
export class ArtistManagementComponent implements OnInit {
  artists: Artist[] = [];
  artistForm!: FormGroup;
  socialLinksForm!: FormGroup;
  selectedFile: File | null = null;
  currentPhotoUrl: string | null = null;
  editMode = false;
  editingId: number | null = null;
  showForm = false;
  isSubmitting = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadArtists();
    this.initForm();
  }

  initForm(artist?: Artist): void {
    this.socialLinksForm = this.fb.group({
      instagram: [artist?.socialLinks?.instagram || ''],
      facebook: [artist?.socialLinks?.facebook || ''],
      twitter: [artist?.socialLinks?.twitter || ''],
      soundcloud: [artist?.socialLinks?.soundcloud || '']
    });

    this.artistForm = this.fb.group({
      name: [artist?.name || '', [Validators.required]],
      role: [artist?.role || '', [Validators.required]],
      bio: [artist?.bio || '', [Validators.required, Validators.minLength(10)]],
      socialLinks: this.socialLinksForm
    });

    if (artist?.photoUrl) {
      this.currentPhotoUrl = artist.photoUrl;
    } else {
      this.currentPhotoUrl = null;
    }
  }

  loadArtists(): void {
    this.http.get<Artist[]>('http://localhost:3000/api/artists')
      .subscribe(data => {
        this.artists = data;
      });
  }

  showAddForm(): void {
    this.editMode = false;
    this.editingId = null;
    this.initForm();
    this.showForm = true;
  }

  editArtist(artist: Artist): void {
    this.editMode = true;
    this.editingId = artist.id;
    this.initForm(artist);
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
    if (this.artistForm.invalid) {
      this.markFormGroupTouched(this.artistForm);
      return;
    }

    this.isSubmitting = true;
    const formData = this.artistForm.value;

    // Si un fichier a été sélectionné, téléchargez-le d'abord
    if (this.selectedFile) {
      const fileFormData = new FormData();
      fileFormData.append('file', this.selectedFile);

      this.http.post<any>('http://localhost:3000/api/upload/image', fileFormData)
        .subscribe({
          next: (fileResponse) => {
            // Ajoutez l'URL de la photo au formulaire
            formData.photoUrl = `http://localhost:3000${fileResponse.path}`;
            this.saveArtist(formData);
          },
          error: (error) => {
            console.error('Error uploading file:', error);
            this.isSubmitting = false;
          }
        });
    } else {
      // Si pas de nouveau fichier et en mode édition, conservez la photo existante
      if (this.editMode && this.currentPhotoUrl) {
        formData.photoUrl = this.currentPhotoUrl;
      }
      this.saveArtist(formData);
    }
  }

  saveArtist(formData: any): void {
    if (this.editMode && this.editingId) {
      this.http.put<Artist>(`http://localhost:3000/api/artists/${this.editingId}`, formData)
        .subscribe({
          next: () => {
            this.isSubmitting = false;
            this.showForm = false;
            this.loadArtists();
          },
          error: (error) => {
            console.error('Error updating artist:', error);
            this.isSubmitting = false;
          }
        });
    } else {
      this.http.post<Artist>('http://localhost:3000/api/artists', formData)
        .subscribe({
          next: () => {
            this.isSubmitting = false;
            this.showForm = false;
            this.loadArtists();
          },
          error: (error) => {
            console.error('Error creating artist:', error);
            this.isSubmitting = false;
          }
        });
    }
  }

  deleteArtist(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet artiste ?')) {
      this.http.delete(`http://localhost:3000/api/artists/${id}`)
        .subscribe({
          next: () => {
            this.loadArtists();
          },
          error: (error) => {
            console.error('Error deleting artist:', error);
          }
        });
    }
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
