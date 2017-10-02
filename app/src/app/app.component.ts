import { Component } from '@angular/core';
import { VideoService } from './shared/video.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'current';
  videos: Array<any>;
  constructor(private _videoService: VideoService) {}

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
    // show html5 player with url for request
  }
}
