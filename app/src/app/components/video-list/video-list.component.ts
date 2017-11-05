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
  hide;

  constructor(
    private _videoService: VideoService
  ) {
    this.load();

    this._videoService.getVideo().subscribe((video) => {
      if(video.url) {
        this.hide = true;
      } else {
        this.hide = false;
      }
    });
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

  randomColor = (): string => {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  }

  watch = (video) => {
    this._videoService.setVideo(video.id);
  }
}
