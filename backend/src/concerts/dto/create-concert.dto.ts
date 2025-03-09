import { IsNotEmpty, IsString, IsOptional, IsUrl, IsBoolean, IsDateString } from 'class-validator';

export class CreateConcertDto {
  @IsNotEmpty({ message: 'Le titre est requis' })
  @IsString({ message: 'Le titre doit être une chaîne de caractères' })
  title: string;

  @IsNotEmpty({ message: 'La date est requise' })
  @IsDateString({}, { message: 'Format de date invalide' })
  date: string;

  @IsNotEmpty({ message: 'La salle est requise' })
  @IsString({ message: 'La salle doit être une chaîne de caractères' })
  venue: string;

  @IsNotEmpty({ message: 'La ville est requise' })
  @IsString({ message: 'La ville doit être une chaîne de caractères' })
  city: string;

  @IsNotEmpty({ message: 'La description est requise' })
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  description: string;

  @IsOptional()
  @IsUrl({}, { message: 'Lien de billetterie invalide' })
  ticketLink?: string;

  @IsOptional()
  @IsString({ message: 'L\'URL de l\'image doit être une chaîne de caractères' })
  imageUrl?: string;

  @IsOptional()
  @IsBoolean({ message: 'La mise en avant doit être un booléen' })
  isFeatured?: boolean;
}
