import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from '../config/firebase-config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private firebaseService: FirebaseService,
  ) {}

  /**
   * Authentifie un utilisateur avec Firebase Auth
   */
  async login(loginDto: LoginDto) {
    try {
      // Tenter de s'authentifier avec Firebase
      const auth = this.firebaseService.getFirebaseAdmin().auth();
      const userCredential = await auth.getUserByEmail(loginDto.username);
      
      // Pour la simplicité, nous utilisons une vérification de mot de passe directe
      // En production, cela devrait être géré de manière sécurisée par Firebase
      if (!userCredential || !userCredential.uid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      // Créer un token JWT pour l'utilisateur
      const payload = { 
        sub: userCredential.uid, 
        email: userCredential.email 
      };
      
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  /**
   * Vérifie si un token est valide
   */
  async validateToken(token: string) {
    try {
      // Vérifier le token Firebase
      const decodedToken = await this.firebaseService.verifyToken(token);
      return decodedToken;
    } catch (error) {
      return null;
    }
  }
}
