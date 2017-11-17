import { Injectable } from '@angular/core';
import { Http, Request, Headers } from '@angular/http';
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

  post(url: string, body = {}) {
    const json = <JSON>body;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    const options = {
      headers: headers,
      withCredentials: true
    };
    return this.http.post(url, json, options);
  }
}
