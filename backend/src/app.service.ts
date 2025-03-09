import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      status: 'online',
      api: 'Collectif Ladyland API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
