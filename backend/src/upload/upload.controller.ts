import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  UseGuards, 
  BadRequestException,
  HttpStatus
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(AuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    if (!file.mimetype.includes('image')) {
      throw new BadRequestException('Seules les images sont autorisées');
    }

    const imageUrl = this.uploadService.getFileUrl(file);
    
    return {
      status: HttpStatus.CREATED,
      message: 'Image téléchargée avec succès',
      path: imageUrl,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  @UseGuards(AuthGuard)
  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    if (!file.mimetype.includes('video')) {
      throw new BadRequestException('Seules les vidéos sont autorisées');
    }

    const videoUrl = this.uploadService.getFileUrl(file);
    
    return {
      status: HttpStatus.CREATED,
      message: 'Vidéo téléchargée avec succès',
      path: videoUrl,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  @UseGuards(AuthGuard)
  @Post('audio')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudio(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    if (!file.mimetype.includes('audio')) {
      throw new BadRequestException('Seuls les fichiers audio sont autorisés');
    }

    const audioUrl = this.uploadService.getFileUrl(file);
    
    return {
      status: HttpStatus.CREATED,
      message: 'Audio téléchargé avec succès',
      path: audioUrl,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
