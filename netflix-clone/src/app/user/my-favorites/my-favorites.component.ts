import { Component, HostListener, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { DialogServiceService } from '../../shared/services/dialog-service.service';
import { ErrorhandlerService } from '../../shared/services/errorhandler.service';
import { MediaService } from '../../shared/services/media.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UtilityService } from '../../shared/services/utility.service';
import { VideoService } from '../../shared/services/video.service';
import { WatchListService } from '../../shared/services/watch-list.service';

@Component({
  selector: 'app-my-favorites',
  standalone: false,
  templateUrl: './my-favorites.component.html',
  styleUrl: './my-favorites.component.css'
})
export class MyFavoritesComponent implements OnInit {
  allVideos: any = [];
  filteredVideos: any = [];
  loading = true;
  loadingMore = false;
  error = false;
  searchQuery: string = '';

  currentPage = 0;
  pageSize = 10;
  totalElement = 0;
  totalPages = 0;
  hasMoreVideos = true;

  private searchSubject = new Subject<string>();

  constructor(
    private videoService: VideoService,
    private watchlistService: WatchListService,
    private notificationService: NotificationService,
    public utilityService: UtilityService,
    public mediaService: MediaService,
    private dialogService: DialogServiceService,
    private errorHandlerService: ErrorhandlerService
  ) { }


  ngOnInit(): void {
    this.loadVideos();
    this.initializeSearchDebounce();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  initializeSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.performSearch();
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollPosition = window.pageYOffset + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    if (scrollPosition >= pageHeight - 200 && !this.loadingMore && !this.loading && this.hasMoreVideos) {
      this.loadMoreVideos();
    }
  }

  loadVideos(page: number = 0) {
    this.error = false;
    this.currentPage = 0;
    this.allVideos = [];
    this.filteredVideos = [];
    const search = this.searchQuery.trim() || undefined;
    this.loading = true;

    this.watchlistService.getWatchlist(page, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.allVideos = response.content;
        this.filteredVideos = response.content;
        this.currentPage = response.number;
        this.totalElement = response.totalElement;
        this.totalPages = response.totalPages || response.TotalPages;
        this.hasMoreVideos = this.currentPage < this.totalPages - 1;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error Loading video', err);
        this.error = true;
        this.loading = false;
      }
    })
  }

  loadMoreVideos() {
    if (this.loadingMore || !this.hasMoreVideos) return;
    this.loadingMore = true;
    const nextPage = this.currentPage + 1;
    const search = this.searchQuery.trim() || undefined;

    this.watchlistService.getWatchlist(nextPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.allVideos = [...this.allVideos, ...response.content];
        this.filteredVideos = [...this.filteredVideos, ...response.content];
        this.currentPage = response.number;
        this.totalPages = response.totalPages || response.TotalPages;
        this.hasMoreVideos = this.currentPage < this.totalPages - 1;
        this.loadingMore = false;
      },
      error: (err) => {
        this.notificationService.error('Failed to load more videos');
        this.loadingMore = false;
      }
    });
  }

  onSearch() {
    this.searchSubject.next(this.searchQuery);
  }


  private performSearch() {
    this.currentPage = 0;
    this.loadVideos();
  }

  clearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadVideos();
  }

  toggleWatchlist(video: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const videoId = video.id;
    this.watchlistService.removeFromWatchlist(videoId).subscribe({
      next: () => {
        this.allVideos = this.allVideos.filter((v: any) => v.id !== videoId);
        this.filteredVideos = this.filteredVideos.filter((v: any) => v.id !== videoId);
        this.notificationService.success('Removed from my favorites')
      },
      error: (err) => {
        this.errorHandlerService.handler(err, 'Failed to remove from My Favorites. Please try again');
      }
    });
  }

  getPosterUrl(video: any) {
    return this.mediaService.getMediaUrl(video, 'image', {
      useCache: true,
    }) || '';
  }

  playVideo(video: any) {
    this.dialogService.openVideoPlayer(video);
  }

  formatDuration(seconds: number | undefined): string {
    return this.utilityService.formatDuration(seconds);
  }




}
