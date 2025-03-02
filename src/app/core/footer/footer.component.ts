import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com/collectifladyland', icon: 'fab fa-facebook-f' },
    { name: 'Instagram', url: 'https://instagram.com/collectifladyland', icon: 'fab fa-instagram' },
    { name: 'YouTube', url: 'https://youtube.com/collectifladyland', icon: 'fab fa-youtube' },
    { name: 'Spotify', url: 'https://open.spotify.com/artist/collectifladyland', icon: 'fab fa-spotify' }
  ];
}
