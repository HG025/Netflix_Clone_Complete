import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ErrorhandlerService } from '../../services/errorhandler.service';

@Component({
  selector: 'app-change-password-dialog',
  standalone: false,
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.css'
})
export class ChangePasswordDialogComponent{

  changePasswordForm !:FormGroup;
  loading = false;
  hideCurrent = true;
  hideNew = true;
  hideConfirm = true;
  constructor( 
    private fb : FormBuilder,
    private dialogRef : MatDialogRef<ChangePasswordDialogComponent>,
    private authService: AuthService,
    private notificationService: NotificationService,
    private errorHandlerService: ErrorhandlerService
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['',[Validators.required, this.authService.passwordMatchValidator('newPassword')]]
    })
  }

  submit() {
    this.loading = true;
    const formData = this.changePasswordForm.value;
    const data = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    };
    this.authService.changePassword(data).subscribe({
      next: (response : any) => {
        this.loading = false;
        this.notificationService.success(response.message || 'Password change successfully');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.errorHandlerService.handler(err, 'Failed to change password. Please try again');
      }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }



}
