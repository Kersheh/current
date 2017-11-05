import { Injectable } from '@angular/core';
import { Http, Request } from '@angular/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ProxyService {

  constructor (
    private http: Http
  ) {}

  get(url: string) {
    const options = {
      withCredentials: true
    };
    return this.http.get(url, options);
  }

  post(url: string, body, credentials = false) {
    const json = <JSON>body;
    const options = {
      withCredentials: credentials
    };
    return this.http.post(url, json, options);
  }
}
