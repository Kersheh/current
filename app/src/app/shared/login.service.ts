import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class LoginService {
  private session;
  private body;

  constructor(
    private http: Http
  ) { }

  login(username, password) {
    this.body = {
      user: {
        username: username,
        password: password
      }
    };

    return this.http.post('http://127.0.0.1:3000/auth/login', <JSON>this.body)
      .map((res: Response) => console.log(res));
  }

  logout(username) {
    this.body = {
      user: {
        username: username
      }
    };

    return this.http.post('http://127.0.0.1:3000/auth/logout', <JSON>this.body)
      .map((res: Response) => console.log(res));
  }
}
