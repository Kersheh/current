import { Component } from '@angular/core';
import { VideoService } from './shared/video.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'current';
  videos: Array<any>;
  show_list: boolean = true;
  video_url: string;
  constructor(private _videoService: VideoService) {
    this.loadVideoList();
  }

  loadVideoList = () => {
    this._videoService.getVideos().subscribe(
      (videos) => {
        this.videos = videos;
      },
      (err: Error) => {
        console.error('Error fetching video list');
      }
    );
  }

  watchVideo = (video) => {
    this.show_list = false;
    this.video_url = 'http://127.0.0.1:3000/video/' + video.id;
  }
}
