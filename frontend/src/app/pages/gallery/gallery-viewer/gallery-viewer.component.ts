import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Media, MediaType} from '../../../models/media.model';

@Component({
  selector: 'app-gallery-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-viewer.component.html',
  styleUrls: ['./gallery-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() items: Media[] = [];
  @Input() activeIndex = 0;
  @Input() options: { fullscreen: boolean; slideshow: boolean } = {
    fullscreen: false,
    slideshow: false
  };

  @Output() close = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<'prev' | 'next'>();
  @Output() toggleFullscreen = new EventEmitter<void>();
  @Output() toggleSlideshow = new EventEmitter<void>();

  MediaType = MediaType;
  slideInterval: any = null;
  touchStartX = 0;
  touchEndX = 0;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Prevent body scrolling when viewer is open
    document.body.style.overflow = 'hidden';

    // Calculate scrollbar width and add margin to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.marginRight = `${scrollbarWidth}px`;

    // Set CSS variable for scrollbar width (used in the component styling)
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
  }

  ngAfterViewInit(): void {
    // Start slideshow if enabled
    this.updateSlideshow();
  }

  ngOnDestroy(): void {
    // Restore body scrolling when component is destroyed
    document.body.style.overflow = '';
    document.body.style.marginRight = '';

    // Clear slideshow interval
    this.clearSlideshow();
  }

  onClose(): void {
    this.close.emit();
  }

  onNavigate(direction: 'prev' | 'next'): void {
    this.navigate.emit(direction);

    // Reset slideshow timer when manually navigating
    if (this.options.slideshow) {
      this.updateSlideshow();
    }
  }

  onToggleFullscreen(): void {
    this.toggleFullscreen.emit();
  }

  onToggleSlideshow(): void {
    this.toggleSlideshow.emit();
    this.updateSlideshow();
  }

  updateSlideshow(): void {
    this.clearSlideshow();

    if (this.options.slideshow) {
      this.slideInterval = setInterval(() => {
        this.navigate.emit('next');
      }, 4000);
    }
  }

  clearSlideshow(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  isSafeUrl(url: string): boolean {
    return (
      url.startsWith('https://www.youtube.com/embed/') ||
      url.startsWith('https://player.vimeo.com/video/') ||
      url.startsWith('https://soundcloud.com/') ||
      url.startsWith('https://open.spotify.com/') ||
      url.startsWith('/')
    );
  }

  getActiveItem(): Media | null {
    return this.items.length > this.activeIndex ? this.items[this.activeIndex] : null;
  }

  // Touch events handling for swipe navigation
  onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  onTouchEnd(e: TouchEvent): void {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe(): void {
    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    if (this.touchStartX - this.touchEndX > minSwipeDistance) {
      // Swipe left, go to next
      this.onNavigate('next');
    } else if (this.touchEndX - this.touchStartX > minSwipeDistance) {
      // Swipe right, go to prev
      this.onNavigate('prev');
    }
  }

  // Prevent event propagation for media controls
  onMediaControlsClick(event: Event): void {
    event.stopPropagation();
  }
}
