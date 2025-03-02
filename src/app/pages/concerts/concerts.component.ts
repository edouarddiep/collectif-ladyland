import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Concert } from '../../models/concert.model';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-concerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './concerts.component.html',
  styleUrls: ['./concerts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConcertsComponent implements OnInit {
  upcomingConcerts$!: Observable<Concert[]>;
  pastConcerts$!: Observable<Concert[]>;

  activeConcertId: number | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.upcomingConcerts$ = this.apiService.getUpcomingConcerts();
    this.pastConcerts$ = this.apiService.getPastConcerts();
  }

  toggleConcertDetails(concertId: number): void {
    if (this.activeConcertId === concertId) {
      this.activeConcertId = null;
    } else {
      this.activeConcertId = concertId;
    }
  }

  isActive(concertId: number): boolean {
    return this.activeConcertId === concertId;
  }
}
