import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
@Injectable({
  providedIn: 'root'
})
export class ErrorhandlerService {

  constructor(private notification: NotificationService) { }
 
   handler(err: any, fallbackMessage: string){
     const errorMsg = err.error?.error || fallbackMessage;
     this.notification.error(errorMsg);
     console.error('API error:', err);
   }
 }
 