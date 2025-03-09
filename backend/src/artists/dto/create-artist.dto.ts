import { IsNotEmpty, IsString, IsOptional, ValidateNested, IsUrl, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class SocialLinksDto {
  @IsOptional()
  @IsUrl({}, { message: 'Instagram URL invalide' })
  instagram?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Facebook URL invalide' })
  facebook?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Twitter URL invalide' })
  twitter?: string;

  @IsOptional()
  @IsUrl({}, { message: 'SoundCloud URL invalide' })
  soundcloud?: string;

  @IsOptional()
  @IsUrl({}, { message: 'YouTube URL invalide' })
  youtube?: string;
}

export class CreateArtistDto {
  @IsNotEmpty({ message: 'Le nom est requis' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  name: string;

  @IsNotEmpty({ message: 'Le rôle est requis' })
  @IsString({ message: 'Le rôle doit être une chaîne de caractères' })
  role: string;

  @IsNotEmpty({ message: 'La biographie est requise' })
  @IsString({ message: 'La biographie doit être une chaîne de caractères' })
  @MinLength(10, { message: 'La biographie doit contenir au moins 10 caractères' })
  bio: string;

  @IsOptional()
  @IsString({ message: 'L\'URL de la photo doit être une chaîne de caractères' })
  photoUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;
}
