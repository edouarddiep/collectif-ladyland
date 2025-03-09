import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';
import {FirebaseModule} from "./firebase.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'firebase-jwt' }),
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
    FirebaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, FirebaseAuthStrategy],
  exports: [AuthService],
})
export class AuthModule {}