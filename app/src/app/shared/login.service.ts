import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ProxyService } from './proxy.service';

@Injectable()
export class LoginService {
  private session;
  private body;

  constructor(
    private http: Http,
    private proxy: ProxyService
  ) {}

  login(username, password) {
    this.body = {
      user: {
        username: username,
        password: password
      }
    };

    return this.proxy.post('http://127.0.0.1:3000/auth/login', this.body, true)
      .map((res: Response) => console.log(res));
  }

  logout(username) {
    this.body = {
      user: {
        username: username
      }
    };

    return this.proxy.post('http://127.0.0.1:3000/auth/logout', this.body)
      .map((res: Response) => console.log(res));
  }
}
