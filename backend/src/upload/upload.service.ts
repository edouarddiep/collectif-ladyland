import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  getFileUrl(file: Express.Multer.File): string {
    // Déterminer le sous-dossier en fonction du type MIME
    let subDir = 'images';
    if (file.mimetype.includes('video')) {
      subDir = 'videos';
    } else if (file.mimetype.includes('audio')) {
      subDir = 'audio';
    }

    // Construire le chemin relatif du fichier pour l'URL
    return `/uploads/${subDir}/${path.basename(file.path)}`;
  }
}
