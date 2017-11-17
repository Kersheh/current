import { Component, Input } from '@angular/core';
import { VideoService } from '../../shared/video.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'current-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent {
  private static socket_url = 'http://127.0.0.1:3000/socket/player';
  private socket;
  video_url: string;

  constructor(
    private _videoService: VideoService
  ) {
    _videoService.getVideo().subscribe((video) => {
      if (video && video.url) {
        this.video_url = video.url;
      } else {
        this.video_url = null;
      }
    });

    this.socket = io(VideoComponent.socket_url);

    this.socket.on('playerUpdate', this.playerUpdate);
  }

  public close = (): void => {
    this._videoService.clearVideo();
  }

  public play() {
    this.socket.emit('play');
  }

  public pause() {
    this.socket.emit('pause');
  }

  public changeTime(timestamp) {
    this.socket.emit('changeTime', timestamp);
  }

  public changeVideo(id: string) {
    this.socket.emit('changeVideo', id);
  }

  public playerUpdate(state) {
    console.log(state);
  }
}
