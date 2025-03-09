import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Artist } from '../../models/artist.model';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
  artists$!: Observable<Artist[]>;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.artists$ = this.apiService.getArtists();
  }
}
