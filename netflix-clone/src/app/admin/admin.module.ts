import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ManageVideoComponent } from './dialog/manage-video/manage-video.component';
import { VideoListComponent } from './video-list/video-list.component';
import { SharedModule } from '../shared/shared.module';
import { UserListComponent } from './user-list/user-list.component';
import { ManageUserComponent } from './dialog/manage-user/manage-user.component';


@NgModule({
  declarations: [
    ManageVideoComponent,
    VideoListComponent,
    UserListComponent,
    ManageUserComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
