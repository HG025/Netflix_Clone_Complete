import { Component, HostListener, OnInit } from '@angular/core';
import { DialogServiceService } from '../../shared/services/dialog-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '../../shared/services/notification.service';
import { VideoService } from '../../shared/services/video.service';
import { UtilityService } from '../../shared/services/utility.service';
import { MediaService } from '../../shared/services/media.service';
import { ErrorhandlerService } from '../../shared/services/errorhandler.service';

@Component({
  selector: 'app-video-list',
  standalone: false,
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.css'
})
export class VideoListComponent implements OnInit {
  pagedVideos: any = [];
  loading = false;
  loadingMore = false;
  searchQuery = '';
  pageSize = 10;
  currentPage = 0;
  totalPages = 0;
  totalElement = 0;
  hasMoreVideos = true;
  totalVideos = 0;
  publishedVideos = 0
  totalDurationSeconds = 0;
  // data = new MatTableDataSource<any>();

  constructor(
    private dialogService: DialogServiceService,
    private notificationService: NotificationService,
    private videoService: VideoService,
    private errorHandlerServer: ErrorhandlerService,
    public utilityService: UtilityService,
    public mediaService: MediaService
  ) { }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollPosition = window.pageYOffset + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 200 && !this.loadingMore && !this.loading && this.hasMoreVideos) {
      this.loadMoreVideos();
    }
  }



  load() {
    this.loading = true;
    this.currentPage = 0;
    this.pagedVideos = [];
    const search = this.searchQuery.trim() || undefined;
    this.videoService.getAllAdminVideos(this.currentPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        console.log("Videos Response:", response);
        this.pagedVideos = response.content;
        this.totalElement = response.totalElement;
        this.totalPages = response.TotalPages;
        this.currentPage = response.number;
        this.hasMoreVideos = this.currentPage < this.totalPages - 1;
        // this.data.data = this.pagedVideos;
        this.loading = false;
      },
      error: (err) => {
        this.loadingMore = false;
        this.errorHandlerServer.handler(err, 'Failed to load more videos')
      }
    })
  }

  loadMoreVideos() {
    if (this.loadingMore || !this.hasMoreVideos) {
      return;
    }
    this.loadingMore = true;
    const nextPage = this.currentPage + 1;
    const search = this.searchQuery.trim() || undefined;
    this.videoService.getAllAdminVideos(nextPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.pagedVideos = [...this.pagedVideos, ...response.content];
        this.currentPage = response.number;
        this.hasMoreVideos = this.currentPage < this.totalPages - 1;
        this.loadingMore = false;
      },
      error: (err) => {
        this.loadingMore = false;
        this.errorHandlerServer.handler(err, 'Failed to load more videos')
      }
    })
  }

  loadStats() {
    this.videoService.getStatsByAdmin().subscribe((stats: any) => {
      this.totalVideos = stats.totalVideos;
      this.publishedVideos = stats.publishedVideos;
      this.totalDurationSeconds = stats.totalDuration;
    })
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.currentPage = 0;
    this.load();
  }

  clearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.load();
  }

  play(video: any) {
    this.dialogService.openVideoPlayer(video);
  }

  createNew() {
    const dialogRef = this.dialogService.openVideoFormDialog('create');
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.load();
        this.loadStats();
      }
    })
  }

  edit(video: any) {
    const dialogRef = this.dialogService.openVideoFormDialog('edit', video);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.load();
        this.loadStats();
      }
    })
  }

  remove(video: any) {
    this.dialogService.openConfirmation(
      'Delete Video?',
      `Are you sure you want to delete "${video.title}"? This action can not be undone.`,
      'Delete',
      'Cancel',
      'danger'
    ).subscribe(response => {
      if (response) {
        this.loading = true;
        this.videoService.deleteVideoByAdmin(video.id).subscribe({
          next: () => {
            this.notificationService.success('Video delted successfully');
            this.load();
            this.loadStats();
          },
          error: (err) => {
            this.loading = false;
            this.errorHandlerServer.handler(err, 'Failed to delete video. Please try again.')
          }
        })
      }
    })
  }

  togglePublish(event: any, video: any) {
    const newPublishedState = event.checked;
    this.videoService.setPublishedByAdmin(video.id, newPublishedState).subscribe({
      next: (response: any) => {
        video.published = newPublishedState;
        this.notificationService.success(`Video ${video.published ? 'published' : 'unpublished'} successfully`);
        this.loadStats();
      },
      error: (err) => {
        video.published = !newPublishedState;
        this.errorHandlerServer.handler(err, 'Failed to update publish status. Please try again.')
      }
    })
  }

  getPublishedCount(): number {
    return this.publishedVideos;
  }

  getTotalDuration(): string {
    const total = this.totalDurationSeconds;
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  formatDuration(seconds: number): string {
    return this.utilityService.formatDuration(seconds);
  }

  getPosterUrl(video: any) {
    return this.mediaService.getMediaUrl(video, 'image', {
      useCache: true,
    })
  }


  ngOnInit(): void {
    this.load();
    this.loadStats();
  }

}
