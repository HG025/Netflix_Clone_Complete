import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../components/change-password-dialog/change-password-dialog.component';
import { DIALOG_CONFIG } from '../contants/app.constants';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { ManageVideoComponent } from '../../admin/dialog/manage-video/manage-video.component';
import { VideoPlayerComponent } from '../components/video-player/video-player.component';
import { ManageUserComponent } from '../../admin/dialog/manage-user/manage-user.component';

@Injectable({
  providedIn: 'root'
})
export class DialogServiceService {

  constructor(
    private dialog: MatDialog
  ) { }

  openChangePasswordDialog(): MatDialogRef<ChangePasswordDialogComponent> {
    return this.dialog.open(ChangePasswordDialogComponent, DIALOG_CONFIG.CHANGE_PASSWORD)
  }

  openConfirmation(
    title: string,
    message: string,
    confirmText: string = 'Confirm',
    canceltext: string = 'Cancel',
    type: 'warning' | 'danger' | 'info' = 'warning'
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      ...DIALOG_CONFIG.CONFIRM,
      data: {
        title, message, confirmText, canceltext, type
      }
    });
    return dialogRef.afterClosed();
  }

  openVideoFormDialog(mode: 'create' | 'edit', video?: any): MatDialogRef<ManageVideoComponent> {
    return this.dialog.open(ManageVideoComponent, {
      ...DIALOG_CONFIG.VIDEO_FORM,
      data: { mode, video }
    });
  }

  openVideoPlayer(video: any): MatDialogRef<VideoPlayerComponent> {
    return this.dialog.open(VideoPlayerComponent, {
      data: video,
      ...DIALOG_CONFIG.VIDEO_PLAYER,
    });
  }

  openManageUserDialog(mode: 'create' | 'edit', user?: any): MatDialogRef<ManageUserComponent> {
    return this.dialog.open(ManageUserComponent, {
      ...DIALOG_CONFIG.MANAGE_USER,
      data: { mode, user }
    });
  }


}
