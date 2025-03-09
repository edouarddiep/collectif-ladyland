import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {FirebaseService} from "../config/firebase-config";

@Module({
    imports: [ConfigModule],
    providers: [FirebaseService],
    exports: [FirebaseService]
})
export class FirebaseModule {}