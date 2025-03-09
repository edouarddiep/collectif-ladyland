export interface Artist {
  id: number;
  name: string;
  role: string;
  bio: string;
  photoUrl?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    soundcloud?: string;
    youtube?: string;
  };
}