import { MediaType } from './media.model';

export interface Album {
  id: string;
  title: string;
  coverUrl: string;
  count: number;
  type: MediaType;
  description?: string;
}
