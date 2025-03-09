import { Module } from '@nestjs/common';
import { ConcertsController } from './concerts.controller';
import { FirebaseService } from '../config/firebase-config';
import {ConcertsService} from "./concerts.service";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  controllers: [ConcertsController],
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
  ],
  providers: [ConcertsService, FirebaseService],
  exports: [ConcertsService]
})
export class ConcertsModule {}
