import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class VideoService {
  private video = new Subject<any>();

  constructor (
    private http: Http
  ) {
  }

  getVideoList() {
    return this.http.get('http://127.0.0.1:3000/videos')
    .map((res:Response) => res.json());
  }

  setVideo(id: string) {
      this.video.next({ url: 'http://127.0.0.1:3000/video/' + id });
  }

  clearVideo() {
      this.video.next();
  }

  getVideo(): Observable<any> {
      return this.video.asObservable();
  }
}
