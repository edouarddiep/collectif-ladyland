import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-skeleton.component.html',
  styleUrls: ['./gallery-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GallerySkeletonComponent {
  // Générer un tableau pour l'itération dans le template
  skeletonItems = Array(12).fill(0);
}
