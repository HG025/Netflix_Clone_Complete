import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from '../../services/utility.service';
import { MediaService } from '../../services/media.service';

@Component({
  selector: 'app-video-player',
  standalone: false,
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css'
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;

  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 1;
  isMuted = false;
  isFullscreen = false;
  showControls = true;
  controlsTimeout: any;
  private boundFullsreenHandler: any;
  private boundKeydownHandler: any;
  authenticatedVideoUrl: string | null = null;

  // 1. constructor
  constructor(
    public dialogRef: MatDialogRef<VideoPlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public video: any,
    public utilityService: UtilityService,
    private mediaService: MediaService
  ) {
    this.boundFullsreenHandler = this.onFullscreenChange.bind(this);
    this.boundKeydownHandler = this.onkeyDown.bind(this);

    this.loadAuthenticatedVideo();
  }


  // 2. LifeCycle hooks

  ngOnInit(): void {
    this.startControlTimer();

    document.addEventListener('fullscreenchange', this.boundFullsreenHandler);
    document.addEventListener('keydown', this.boundKeydownHandler);

    this.dialogRef.beforeClosed().subscribe(() => {
      this.cleanup();
    })

  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // 3. Initilization & cleanup

  private loadAuthenticatedVideo(): void {
    this.authenticatedVideoUrl = this.mediaService.getMediaUrl(this.video.src, 'video');
  }

  private cleanup() {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
      this.controlsTimeout = null;
    }
    document.removeEventListener('fullscreenchange', this.boundFullsreenHandler);
    document.removeEventListener('keydown', this.boundKeydownHandler);

    if (this.videoElement?.nativeElement) {
      const video = this.videoElement.nativeElement;
      video.pause();
      video.currentTime = 0;
      video.src = '';
      video.load();
      this.isPlaying = false;
    }

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {
      });
    }
  }

  // 4.  Event Handler

  onFullscreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
  }


  onLoadedMetadata() {
    if (this.videoElement?.nativeElement) {
      this.duration = this.videoElement.nativeElement.duration
    }
  }

  onTimeUpdate() {
    if (this.videoElement?.nativeElement) {
      this.currentTime = this.videoElement.nativeElement.currentTime
    }
  }

  onMouseMove() {
    this.showControls = true;
    this.startControlTimer();
  }

  onVideoClick() {
    this.togglePlay();
  }

  onProgressClick(event: MouseEvent) {
    if (!this.videoElement?.nativeElement || !this.duration) {
      return;
    }
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    const newTime = pos * this.duration;

    this.videoElement.nativeElement.currentTime = newTime;
    this.currentTime = newTime;
  }

  onkeyDown(event: KeyboardEvent) {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (event.key.toLowerCase()) {
      case ' ':   //spacebar
      case 'k':
        event.preventDefault();
        this.togglePlay();
        break;

      case 'arrowleft':
        event.preventDefault();
        this.seekBackward();
        break;

      case 'arrowright':
        event.preventDefault();
        this.seekForward();
        break;

      case 'arrowup':
        event.preventDefault();
        this.increaseVolumn();
        break;


      case 'arrowdown':
        event.preventDefault();
        this.decreaseVolumn();
        break;

      case 'm':
        event.preventDefault();
        this.toggleMute();
        break;

      case 'f':
        event.preventDefault();
        this.toggleFullscreen();
        break;

      case 'escape':
        if (document.fullscreenElement) {
          event.preventDefault();
          document.exitFullscreen();
        } else {
          this.closePlayer();
        }
        break;
    }

  }


  // 5. video playback controls

  togglePlay() {
    if (!this.videoElement?.nativeElement) {
      return;
    }
    const video = this.videoElement.nativeElement;
    this.pauseAllOtherVideos(video);

    if (video.paused) {
      video.play().then(() => {
        this.isPlaying = true;
      }).catch(err => {
        console.error("Play error:", err);
        this.isPlaying = false;
      });
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  private pauseAllOtherVideos(currentVideo: HTMLVideoElement) {
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach((video: HTMLVideoElement) => {
      if (video !== currentVideo && !video.paused) {
        video.pause();
      }
    });
  }

  seekBackward() {
    if (!this.videoElement?.nativeElement) {
      return;
    }
    const video = this.videoElement.nativeElement;
    video.currentTime = Math.max(0, video.currentTime - 10);
  }

  seekForward() {
    if (!this.videoElement?.nativeElement) {
      return;
    }
    const video = this.videoElement.nativeElement;
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  }

  // 6. Volume Controls

  toggleMute() {
    if (!this.videoElement?.nativeElement) {
      return;
    }
    const video = this.videoElement.nativeElement;
    video.muted = !video.muted;
    this.isMuted = video.muted;
  }

  changeVolume(event: Event) {
    if (!this.videoElement?.nativeElement) {
      return;
    }
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);

    this.setVolumn(value);
    this.isMuted = this.volume === 0;
  }

  private setVolumn(value: number) {
    if (!this.videoElement?.nativeElement) {
      return;
    }
    const video = this.videoElement.nativeElement;
    video.volume = value;
    this.volume = value;
  }

  increaseVolumn() {
    if (!this.videoElement?.nativeElement) {
      return;
    }
    const newVolume = Math.min(1, this.volume + 0.1);
    this.setVolumn(newVolume);
    this.isMuted = false;
    this.videoElement.nativeElement.muted = false;
  }

  decreaseVolumn() {
    if (!this.videoElement?.nativeElement) {
      return;
    }
    const newVolume = Math.min(0, this.volume - 0.1);
    this.setVolumn(newVolume);
    this.isMuted = newVolume === 0;
  }

  // 7. full screen controls
  toggleFullscreen() {
    const container = document.querySelector('.play-container');
    if (!document.fullscreenElement) {
      container?.requestFullscreen();
      this.isFullscreen = true;
    } else {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }


  // 8. UI controls
  startControlTimer() {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }
    this.controlsTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.showControls = false;
      }
    }, 3000);
  }

  closePlayer() {
    this.dialogRef.close();
  }

  // 9. Utility methods
  formatTime(seconds: number): string {
    return this.utilityService.formatDuration(seconds);
  }

  // 10. Getters

  get videoSrc(): string | null {
    return this.authenticatedVideoUrl;
  }

  get progressPercent(): number {
    return this.duration ? (this.currentTime / this.duration) * 100 : 0;
  }

  get volumePercent(): number {
    return this.volume * 100;
  }





}
