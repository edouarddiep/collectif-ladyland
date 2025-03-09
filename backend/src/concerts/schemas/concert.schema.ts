export interface Concert {
  id: number;
  title: string;
  date: string; // ISO format
  venue: string;
  city: string;
  description: string;
  ticketLink?: string;
  imageUrl?: string;
  isFeatured?: boolean;
}
