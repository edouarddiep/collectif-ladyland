export interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string; // ISO format
  read?: boolean;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}
