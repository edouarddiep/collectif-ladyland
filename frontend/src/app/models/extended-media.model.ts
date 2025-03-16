import { Media as BaseMedia } from '../../../models/media.model';

export interface ExtendedMedia extends BaseMedia {
  albumId?: string;
  width?: number;
  height?: number;
  isLoaded?: boolean;
}
