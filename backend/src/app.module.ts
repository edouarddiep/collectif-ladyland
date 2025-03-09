import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import configuration from './config/configuration';
import { FirebaseService } from './config/firebase-config';
import { AuthModule } from './auth/auth.module';
import { ArtistsModule } from './artists/artists.module';
import { ConcertsModule } from './concerts/concerts.module';
import { MediaModule } from './media/media.module';
import { ContactModule } from './contact/contact.module';
import { UploadModule } from './upload/upload.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {FirebaseModule} from "./auth/firebase.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [{
        rootPath: join(__dirname, '..', configService.get<string>('upload.dest')),
        serveRoot: '/uploads',
      }],
    }),
    AuthModule,
    ArtistsModule,
    ConcertsModule,
    FirebaseModule,
    MediaModule,
    ContactModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}
