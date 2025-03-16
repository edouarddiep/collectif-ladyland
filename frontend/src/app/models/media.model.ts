export enum MediaType {
  PHOTO = 'photo',
  VIDEO = 'video',
  AUDIO = 'audio'
}

export interface Media {
  id: number;
  title: string;
  description?: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  uploadDate: Date | string;
  featured?: boolean;
  sortOrder?: number;

  // Nouvelles propriétés pour l'optimisation
  albumId?: string;
  width?: number;
  height?: number;
  isLoaded?: boolean;
}
