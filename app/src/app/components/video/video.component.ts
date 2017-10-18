import { Component, Input } from '@angular/core';
import { VideoService } from '../../shared/video.service';

@Component({
  selector: 'current-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent {
  video_url: string;
  constructor(private _videoService: VideoService) {
    _videoService.getVideo().subscribe((video) => {
      if (video && video.url) {
        this.video_url = video.url;
      } else {
        this.video_url = null;
      }
    });
  }

  public close = (): void => {
    this._videoService.clearVideo();
  }
}
