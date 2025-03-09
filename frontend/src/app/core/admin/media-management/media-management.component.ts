import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

enum MediaType {
  PHOTO = 'photo',
  VIDEO = 'video',
  AUDIO = 'audio'
}

interface Media {
  id: number;
  title: string;
  description?: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  uploadDate: Date;
  featured?: boolean;
  sortOrder?: number;
}

@Component({
  selector: 'app-media-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './media-management.component.html',
  styleUrls: ['./media-management.component.scss']
})
export class MediaManagementComponent implements OnInit {
  media: Media[] = [];
  mediaForm!: FormGroup;
  selectedFile: File | null = null;
  selectedThumbnail: File | null = null;
  currentUrl: string | null = null;
  currentThumbnailUrl: string | null = null;
  editMode = false;
  editingId: number | null = null;
  showForm = false;
  isSubmitting = false;
  activeFilter: string = 'all';
  filteredMedia: Media[] = [];

  MediaType = MediaType;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadMedia();
    this.initForm();
  }

  initForm(media?: Media): void {
    this.mediaForm = this.fb.group({
      title: [media?.title || '', [Validators.required]],
      description: [media?.description || ''],
      type: [media?.type || MediaType.PHOTO, [Validators.required]],
      url: [media?.url || '', [Validators.required]],
      featured: [media?.featured || false],
      sortOrder: [media?.sortOrder || 0]
    });

    if (media?.url) {
      this.currentUrl = media.url;
    } else {
      this.currentUrl = null;
    }

    if (media?.thumbnailUrl) {
      this.currentThumbnailUrl = media.thumbnailUrl;
    } else {
      this.currentThumbnailUrl = null;
    }
  }

  loadMedia(): void {
    this.http.get<Media[]>('http://localhost:3000/api/media')
      .subscribe(data => {
        this.media = data;
        this.filterMedia(this.activeFilter);
      });
  }

  filterMedia(filter: string): void {
    this.activeFilter = filter;

    if (filter === 'all') {
      this.filteredMedia = [...this.media];
    } else {
      this.filteredMedia = this.media.filter(item => item.type === filter);
    }
  }

  showAddForm(): void {
    this.editMode = false;
    this.editingId = null;
    this.initForm();
    this.showForm = true;
  }

  editMedia(media: Media): void {
    this.editMode = true;
    this.editingId = media.id;
    this.initForm(media);
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.selectedFile = null;
    this.selectedThumbnail = null;
  }

  onMainFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onThumbnailSelected(event: any): void {
    this.selectedThumbnail = event.target.files[0];
  }

  getMediaTypeLabel(type: MediaType): string {
    switch (type) {
      case MediaType.PHOTO:
        return 'Photo';
      case MediaType.VIDEO:
        return 'Vidéo';
      case MediaType.AUDIO:
        return 'Audio';
      default:
        return 'Média';
    }
  }

  onSubmit(): void {
    if (this.mediaForm.invalid) {
      this.markFormGroupTouched(this.mediaForm);
      return;
    }

    this.isSubmitting = true;
    const formData = this.mediaForm.value;
    formData.uploadDate = new Date();

    // Série de promesses pour gérer les téléchargements de fichiers
    const uploads: Promise<void>[] = [];

    // Télécharger le fichier principal si sélectionné
    if (this.selectedFile) {
      const fileUpload = new Promise<void>((resolve, reject) => {
        const fileFormData = new FormData();
        fileFormData.append('file', this.selectedFile!);

        this.http.post<any>('http://localhost:3000/api/upload/image', fileFormData)
          .subscribe({
            next: (response) => {
              formData.url = `http://localhost:3000${response.path}`;
              resolve();
            },
            error: (error) => {
              console.error('Error uploading main file:', error);
              reject(error);
            }
          });
      });
      uploads.push(fileUpload);
    } else if (this.editMode && this.currentUrl) {
      formData.url = this.currentUrl;
    }

    // Télécharger la miniature si sélectionnée
    if (this.selectedThumbnail) {
      const thumbnailUpload = new Promise<void>((resolve, reject) => {
        const thumbnailFormData = new FormData();
        thumbnailFormData.append('file', this.selectedThumbnail!);

        this.http.post<any>('http://localhost:3000/api/upload/image', thumbnailFormData)
          .subscribe({
            next: (response) => {
              formData.thumbnailUrl = `http://localhost:3000${response.path}`;
              resolve();
            },
            error: (error) => {
              console.error('Error uploading thumbnail:', error);
              reject(error);
            }
          });
      });
      uploads.push(thumbnailUpload);
    } else if (this.editMode && this.currentThumbnailUrl) {
      formData.thumbnailUrl = this.currentThumbnailUrl;
    }

    // Une fois tous les téléchargements terminés, enregistrer le média
    Promise.all(uploads)
      .then(() => {
        this.saveMedia(formData);
      })
      .catch(() => {
        this.isSubmitting = false;
      });
  }

  saveMedia(formData: any): void {
    if (this.editMode && this.editingId) {
      this.http.put<Media>(`http://localhost:3000/api/media/${this.editingId}`, formData)
        .subscribe({
          next: () => {
            this.isSubmitting = false;
            this.showForm = false;
            this.loadMedia();
          },
          error: (error) => {
            console.error('Error updating media:', error);
            this.isSubmitting = false;
          }
        });
    } else {
      this.http.post<Media>('http://localhost:3000/api/media', formData)
        .subscribe({
          next: () => {
            this.isSubmitting = false;
            this.showForm = false;
            this.loadMedia();
          },
          error: (error) => {
            console.error('Error creating media:', error);
            this.isSubmitting = false;
          }
        });
    }
  }

  deleteMedia(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) {
      this.http.delete(`http://localhost:3000/api/media/${id}`)
        .subscribe({
          next: () => {
            this.loadMedia();
          },
          error: (error) => {
            console.error('Error deleting media:', error);
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
