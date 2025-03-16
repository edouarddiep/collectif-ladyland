import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Subject, takeUntil, lastValueFrom, forkJoin } from 'rxjs';
import { DashboardDataService } from '../dashboard/service/dashboard-data.service';

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

interface FilePreview {
  file: File;
  name: string;
  src: string;
  size: number; // taille en octets
}

@Component({
  selector: 'app-media-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './media-management.component.html',
  styleUrls: ['./media-management.component.scss']
})
export class MediaManagementComponent implements OnInit, OnDestroy {
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
  formSubmitted = false;

  // Propriétés pour drag & drop
  isDragging = false;
  filesPreview: FilePreview[] = [];
  uploading = false;
  uploadProgress = 0;
  uploadError: string | null = null;

  // Limites pour le téléchargement
  readonly MAX_FILES = 20; // Maximum 20 fichiers
  readonly MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500 Mo en octets
  readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 Mo par fichier

  MediaType = MediaType;

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
    this.loadMedia();

    // S'abonner au service pour recharger les données quand nécessaire
    this.dashboardDataService.reloadData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadMedia();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(media?: Media): void {
    this.mediaForm = this.fb.group({
      title: [media?.title || ''],
      description: [media?.description || ''],
      type: [media?.type || MediaType.PHOTO, [Validators.required]],
      url: [media?.url || ''],
      featured: [media?.featured || false],
      sortOrder: [media?.sortOrder || 0]
    });

    this.formSubmitted = false;
    this.filesPreview = [];
    this.uploadError = null;

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
      .subscribe({
        next: data => {
          this.media = data;
          this.filterMedia(this.activeFilter);
          // Forcer la détection de changement après mise à jour des données
          this.cdr.detectChanges();
        },
        error: error => {
          console.error('Error loading media:', error);
        }
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
    this.filesPreview = [];
    this.formSubmitted = false;
    this.uploadError = null;
  }

  // Gestionnaire d'événements pour Drag & Drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(files);
    }
  }

  onFilesSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.handleFiles(files);
    }
  }

  handleFiles(files: FileList): void {
    // Réinitialiser les erreurs
    this.uploadError = null;

    // Vérifier que tous les fichiers sont des images
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

    // Vérifier le nombre maximum de fichiers
    const totalFiles = this.filesPreview.length + validFiles.length;
    if (totalFiles > this.MAX_FILES) {
      this.uploadError = `Vous ne pouvez pas télécharger plus de ${this.MAX_FILES} fichiers à la fois. (${totalFiles - this.MAX_FILES} fichiers en trop)`;
      return;
    }

    // Calculer la taille totale actuelle
    const currentTotalSize = this.filesPreview.reduce((acc, file) => acc + file.size, 0);

    // Vérifier la taille totale et individuelle des fichiers
    let newTotalSize = currentTotalSize;
    const validatedFiles = [];

    for (const file of validFiles) {
      // Vérifier la taille individuelle
      if (file.size > this.MAX_FILE_SIZE) {
        this.uploadError = `Le fichier ${file.name} dépasse la taille maximale autorisée de ${this.formatSize(this.MAX_FILE_SIZE)}.`;
        continue;
      }

      // Vérifier la taille totale
      newTotalSize += file.size;
      if (newTotalSize > this.MAX_TOTAL_SIZE) {
        this.uploadError = `La taille totale des fichiers dépasse la limite de ${this.formatSize(this.MAX_TOTAL_SIZE)}.`;
        break;
      }

      validatedFiles.push(file);
    }

    // Ajouter les fichiers valides à la liste d'aperçu
    validatedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filesPreview.push({
          file: file,
          name: file.name,
          src: e.target.result,
          size: file.size
        });
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    });

    // Si nous sommes en mode édition, supprimer l'URL actuelle car nous allons la remplacer
    if (this.editMode && this.filesPreview.length > 0) {
      this.currentUrl = null;
    }
  }

  // Formater la taille des fichiers pour l'affichage
  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Calculer la taille totale actuelle des fichiers
  get totalFileSize(): number {
    return this.filesPreview.reduce((acc, file) => acc + file.size, 0);
  }

  // Formater la taille totale des fichiers
  get formattedTotalSize(): string {
    return this.formatSize(this.totalFileSize);
  }

  removeFile(index: number): void {
    this.filesPreview.splice(index, 1);
    // Réinitialiser l'erreur potentielle de taille totale
    if (this.totalFileSize <= this.MAX_TOTAL_SIZE) {
      this.uploadError = null;
    }
  }

  onMainFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    // Créer une prévisualisation
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filesPreview = [{
          file: this.selectedFile!,
          name: this.selectedFile!.name,
          src: e.target.result,
          size: this.selectedFile!.size
        }];
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    }
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

  async onSubmit(): Promise<void> {
    this.formSubmitted = true;

    // Vérifier si le type est défini
    if (this.mediaForm.get('type')?.invalid) {
      this.markFormGroupTouched(this.mediaForm);
      return;
    }

    // Vérifier s'il y a des erreurs d'upload
    if (this.uploadError) {
      return;
    }

    this.isSubmitting = true;
    const formData = this.mediaForm.value;

    try {
      // Si nous avons des fichiers dans la prévisualisation, les télécharger
      if (this.filesPreview.length > 0) {
        this.uploading = true;
        this.uploadProgress = 0;

        // Téléchargement de tous les fichiers
        const uploadUrls = await this.uploadMultipleFiles(this.filesPreview);

        // Si nous avons au moins un fichier téléchargé, l'utiliser comme URL principale
        if (uploadUrls.length > 0) {
          formData.url = uploadUrls[0];

          // Pour les photos, utiliser l'URL principale comme thumbnailUrl si ce n'est pas défini
          if (formData.type === MediaType.PHOTO) {
            formData.thumbnailUrl = formData.thumbnailUrl || formData.url;
          }

          // Si nous avons plusieurs fichiers, créer des entrées supplémentaires
          if (uploadUrls.length > 1) {
            // Sauvegarder le premier fichier dans la forme actuelle
            await this.saveMedia(formData);

            // Créer et sauvegarder des entrées pour chaque fichier supplémentaire
            for (let i = 1; i < uploadUrls.length; i++) {
              const additionalFormData = {...formData};
              additionalFormData.url = uploadUrls[i];

              // Pour les photos, utiliser l'URL principale comme thumbnailUrl
              if (additionalFormData.type === MediaType.PHOTO) {
                additionalFormData.thumbnailUrl = additionalFormData.url;
              }

              // Titre personnalisé si non défini
              if (!additionalFormData.title) {
                additionalFormData.title = `Image ${i + 1}`;
              } else if (uploadUrls.length > 1) {
                additionalFormData.title = `${additionalFormData.title} (${i + 1})`;
              }

              await this.saveMedia(additionalFormData);
            }

            this.finalizeSave();
            return;
          }
        }
      } else if (this.selectedThumbnail && this.mediaForm.get('type')?.value !== MediaType.PHOTO) {
        // Télécharger la miniature si sélectionnée
        this.uploading = true;
        this.uploadProgress = 0;

        const thumbnailUrl = await this.uploadSingleFile(this.selectedThumbnail);
        if (thumbnailUrl) {
          formData.thumbnailUrl = thumbnailUrl;
        }
      } else if (this.editMode) {
        // Conserver les URL existantes en mode édition
        if (this.currentUrl) {
          formData.url = this.currentUrl;

          // Pour les photos, utiliser l'URL principale comme thumbnailUrl si ce n'est pas défini
          if (formData.type === MediaType.PHOTO && !formData.thumbnailUrl) {
            formData.thumbnailUrl = formData.url;
          }
        }
        if (this.currentThumbnailUrl) {
          formData.thumbnailUrl = this.currentThumbnailUrl;
        }
      }

      // Enregistrer le média
      await this.saveMedia(formData);
      this.finalizeSave();

    } catch (error) {
      console.error('Error during media upload/save:', error);
      this.isSubmitting = false;
      this.uploading = false;
    }
  }

  async uploadMultipleFiles(filesList: FilePreview[]): Promise<string[]> {
    const uploadPromises = filesList.map((filePreview, index) => {
      return new Promise<string>((resolve, reject) => {
        const fileFormData = new FormData();
        fileFormData.append('file', filePreview.file);

        this.http.post<any>('http://localhost:3000/api/upload/image', fileFormData, {
          reportProgress: true,
          observe: 'events'
        }).subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
              // Calculer la progression totale en tenant compte de tous les fichiers
              const fileProgress = Math.round(100 * event.loaded / event.total);
              this.uploadProgress = Math.round((index * 100 + fileProgress) / filesList.length);
              this.cdr.detectChanges();
            } else if (event.type === HttpEventType.Response) {
              resolve(`http://localhost:3000${event.body.path}`);
            }
          },
          error: (error) => {
            console.error(`Error uploading file ${filePreview.name}:`, error);
            reject(error);
          }
        });
      });
    });

    return await Promise.all(uploadPromises);
  }

  // Téléchargement d'un seul fichier
  async uploadSingleFile(file: File): Promise<string | null> {
    return new Promise<string | null>((resolve, reject) => {
      const fileFormData = new FormData();
      fileFormData.append('file', file);

      this.http.post<any>('http://localhost:3000/api/upload/image', fileFormData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
            this.cdr.detectChanges();
          } else if (event.type === HttpEventType.Response) {
            resolve(`http://localhost:3000${event.body.path}`);
          }
        },
        error: (error) => {
          console.error('Error uploading file:', error);
          reject(error);
        }
      });
    });
  }

  async saveMedia(formData: any): Promise<void> {
    try {
      if (this.editMode && this.editingId) {
        await lastValueFrom(this.http.put<Media>(`http://localhost:3000/api/media/${this.editingId}`, formData));
      } else {
        await lastValueFrom(this.http.post<Media>('http://localhost:3000/api/media', formData));
      }
    } catch (error) {
      console.error('Error saving media:', error);
      throw error;
    }
  }

  finalizeSave(): void {
    this.isSubmitting = false;
    this.uploading = false;
    this.uploadProgress = 0;
    this.showForm = false;
    this.loadMedia();
    // Déclencher un rechargement global des données
    this.dashboardDataService.triggerReload();
  }

  deleteMedia(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) {
      this.http.delete(`http://localhost:3000/api/media/${id}`)
        .subscribe({
          next: () => {
            this.loadMedia();
            // Déclencher un rechargement global des données
            this.dashboardDataService.triggerReload();
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
