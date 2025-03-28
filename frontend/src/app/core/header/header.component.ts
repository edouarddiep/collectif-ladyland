import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  navItems = [
    { path: '', label: 'Accueil', exact: true },
    { path: 'about', label: 'À propos de nous', exact: false },
    { path: 'concerts', label: 'Concerts', exact: false },
    { path: 'gallery', label: 'Galerie', exact: false },
    { path: 'contact', label: 'Contact', exact: false }
  ];

  menuOpen$ = new BehaviorSubject<boolean>(false);

  toggleMenu(): void {
    this.menuOpen$.next(!this.menuOpen$.getValue());
  }

  closeMenu(): void {
    this.menuOpen$.next(false);
  }
}
