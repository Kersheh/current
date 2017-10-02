import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class VideoService {
  constructor (
    private http: Http
  ) {}

  getVideos() {
    return this.http.get('http://127.0.0.1:3000/videos')
    .map((res:Response) => res.json());
  }

}
