export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptchaToken?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}
