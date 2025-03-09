export interface Concert {
  id: number;
  title: string;
  date: Date;
  venue: string;
  city: string;
  description: string;
  ticketLink?: string;
  imageUrl?: string;
  isFeatured?: boolean;
}
