export enum MediaType {
  PHOTO = 'photo',
  VIDEO = 'video',
  AUDIO = 'audio'
}

export interface Media {
  id: number;
  featured?: boolean;
  uploadDate: string;
  sortOrder?: number;
  description?: string;
  title?: string;
  type: MediaType;
  url?: string;
  thumbnailUrl?: string
}
