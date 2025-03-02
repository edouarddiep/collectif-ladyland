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
  uploadDate: Date;
  featured?: boolean;
  sortOrder?: number;
}
