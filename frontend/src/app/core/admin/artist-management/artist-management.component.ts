import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import {DashboardDataService} from '../dashboard/service/dashboard-data.service';

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
export class ArtistManagementComponent implements OnInit, OnDestroy {
  artists: Artist[] = [];
  artistForm!: FormGroup;
  socialLinksForm!: FormGroup;
  selectedFile: File | null = null;
  currentPhotoUrl: string | null = null;
  editMode = false;
  editingId: number | null = null;
  showForm = false;
  isSubmitting = false;
  formSubmitted = false;

  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private dashboardDataService: DashboardDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Charger les données immédiatement
    this.loadArtists();

    // S'abonner au service pour recharger les données quand nécessaire
    this.dashboardDataService.reloadData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadArtists();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

    this.formSubmitted = false;

    if (artist?.photoUrl) {
      this.currentPhotoUrl = artist.photoUrl;
    } else {
      this.currentPhotoUrl = null;
    }
  }

  loadArtists(): void {
    this.http.get<Artist[]>('http://localhost:3000/api/artists')
      .subscribe({
        next: data => {
          this.artists = data;
          // Forcer la détection de changement après mise à jour des données
          this.cdr.detectChanges();
        },
        error: error => {
          console.error('Error loading artists:', error);
        }
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
    this.formSubmitted = false;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.artistForm.invalid) {
      this.markFormGroupTouched(this.artistForm);
      return;
    }

    this.isSubmitting = true;
    const formData = this.artistForm.value;

    if (this.selectedFile) {
      const fileFormData = new FormData();
      fileFormData.append('file', this.selectedFile);

      this.http.post<any>('http://localhost:3000/api/upload/image', fileFormData)
        .subscribe({
          next: (fileResponse) => {
            formData.photoUrl = `http://localhost:3000${fileResponse.path}`;
            this.saveArtist(formData);
          },
          error: (error) => {
            console.error('Error uploading file:', error);
            this.isSubmitting = false;
          }
        });
    } else {
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
            // Déclencher un rechargement global des données
            this.dashboardDataService.triggerReload();
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
            // Déclencher un rechargement global des données
            this.dashboardDataService.triggerReload();
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
            // Déclencher un rechargement global des données
            this.dashboardDataService.triggerReload();
          },
          error: (error) => {
            console.error('Error deleting artist:', error);
          }
        });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
