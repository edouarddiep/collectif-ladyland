import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Configuration des pipes de validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  
  // Configuration CORS pour le développement
  app.enableCors({
    origin: true, // En production, remplacer par votre domaine
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Préfixe global pour les routes API
  app.setGlobalPrefix('api');
  
  // Créer le répertoire d'uploads s'il n'existe pas
  const uploadDir = configService.get<string>('upload.dest');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // Créer les sous-répertoires pour les différents types de médias
  ['images', 'videos', 'audio'].forEach(dir => {
    const dirPath = path.join(uploadDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
  
  // Démarrer le serveur
  const port = configService.get<number>('port');
  const host = configService.get<string>('host');
  await app.listen(port);
  
  console.log(`Server running on http://${host}:${port}`);
}

bootstrap();
