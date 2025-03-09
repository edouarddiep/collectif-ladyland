import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty({ message: 'Le nom est requis' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  name: string;

  @IsNotEmpty({ message: 'L\'email est requis' })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsNotEmpty({ message: 'Le sujet est requis' })
  @IsString({ message: 'Le sujet doit être une chaîne de caractères' })
  subject: string;

  @IsNotEmpty({ message: 'Le message est requis' })
  @IsString({ message: 'Le message doit être une chaîne de caractères' })
  @MinLength(10, { message: 'Le message doit contenir au moins 10 caractères' })
  message: string;
}
