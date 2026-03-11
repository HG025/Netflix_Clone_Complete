import { Component, OnInit } from '@angular/core';
import { DialogServiceService } from '../../shared/services/dialog-service.service';

@Component({
  selector: 'app-video-list',
  standalone: false,
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.css'
})
export class VideoListComponent{


  constructor(
    private dialogService: DialogServiceService
  ){}

  createNew() {
    const dialogRef = this.dialogService.openVideoFormDialog('create');
  }

}
