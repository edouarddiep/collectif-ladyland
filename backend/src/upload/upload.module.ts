import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: (req, file, cb) => {
            // Détermine le sous-répertoire en fonction du type de fichier
            let uploadPath = path.join(configService.get<string>('UPLOAD_DEST'), 'images');

            if (file.mimetype.includes('video')) {
              uploadPath = path.join(configService.get<string>('UPLOAD_DEST'), 'videos');
            } else if (file.mimetype.includes('audio')) {
              uploadPath = path.join(configService.get<string>('UPLOAD_DEST'), 'audio');
            }

            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            // Génère un nom de fichier unique avec extension d'origine
            const filename = `${uuidv4()}${path.extname(file.originalname)}`;
            cb(null, filename);
          },
        }),
        fileFilter: (req, file, cb) => {
          // Filtrer les types de fichiers autorisés
          const allowedMimetypes = [
            // Images
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/heic', 'image/heif',
            // Vidéos
            'video/mp4', 'video/webm', 'video/quicktime',
            // Audio
            'audio/mpeg', 'audio/wav', 'audio/ogg'
          ];

          if (allowedMimetypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new Error(`Type de fichier non autorisé: ${file.mimetype}`), false);
          }
        },
        limits: {
          fileSize: 50 * 1024 * 1024, // 50 MB max par fichier
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}