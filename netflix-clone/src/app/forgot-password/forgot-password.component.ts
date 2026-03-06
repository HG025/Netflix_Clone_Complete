import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { NotificationService } from '../shared/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit{
  forgotPasswordForm !: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ){
    this.forgotPasswordForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]]
    });
  }

  submit(){
    this.loading = true;
    const email = this.forgotPasswordForm.value.email?.trim().toLowerCase();
    this.authService.forgotPassword(email).subscribe({
      next: (response: any) =>{
        this.loading = false;
        this.notification.success(response.message);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.notification.error(err.error?.error || 'Failed to send reset email. Please try again');
      }
    })
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
