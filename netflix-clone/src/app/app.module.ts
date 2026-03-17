import { inject, NgModule, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { SharedModule } from './shared/shared.module';
import { SignupComponent } from './signup/signup.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { authInterceptor } from './shared/interceptor/auth.interceptor';
import { AuthService } from './shared/services/auth.service';
import { HomeComponent } from './user/home/home.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { ChangePasswordDialogComponent } from './shared/components/change-password-dialog/change-password-dialog.component';
import { MyFavoritesComponent } from './user/my-favorites/my-favorites.component';
@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SignupComponent,
    VerifyEmailComponent,
    HomeComponent,
    ResetPasswordComponent,
    LoginComponent,
    HeaderComponent,
    ForgotPasswordComponent,
    ConfirmDialogComponent,
    ChangePasswordDialogComponent,
    MyFavoritesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      return auth.initilizeAuth();
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
