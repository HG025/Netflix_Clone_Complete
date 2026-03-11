import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ManageVideoComponent } from './dialog/manage-video/manage-video.component';
import { VideoListComponent } from './video-list/video-list.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ManageVideoComponent,
    VideoListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
