import { IsNotEmpty, IsString, IsOptional, IsUrl, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { MediaType } from '../schemas/media.schema';

export class CreateMediaDto {
  @IsNotEmpty({ message: 'Le titre est requis' })
  @IsString({ message: 'Le titre doit être une chaîne de caractères' })
  title: string;

  @IsOptional()
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  description?: string;

  @IsNotEmpty({ message: 'Le type est requis' })
  @IsEnum(MediaType, { message: 'Type de média invalide' })
  type: MediaType;

  @IsNotEmpty({ message: 'L\'URL est requise' })
  @IsString({ message: 'L\'URL doit être une chaîne de caractères' })
  url: string;

  @IsOptional()
  @IsString({ message: 'L\'URL de la miniature doit être une chaîne de caractères' })
  thumbnailUrl?: string;

  @IsOptional()
  @IsBoolean({ message: 'La mise en avant doit être un booléen' })
  featured?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'L\'ordre de tri doit être un nombre' })
  sortOrder?: number;
}
