import { Component, Input } from '@angular/core';
import { VideoService } from '../../shared/video.service';

@Component({
  selector: 'video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent {
  title = 'current';
  videos: Array<any>;
  constructor(private _videoService: VideoService) {
    this.load();
  }

  load = () => {
    this._videoService.getVideoList().subscribe(
      (videos) => {
        this.videos = videos;
      },
      (err: Error) => {
        console.error('Error fetching video list');
      }
    );
  }

  watch = (video) => {
    this._videoService.setVideo(video.id);
  }
}
