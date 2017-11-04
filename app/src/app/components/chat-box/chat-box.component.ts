import { Component } from '@angular/core';
import * as io from 'socket.io-client';

import { LoginService } from '../../shared/login.service';

@Component({
  selector: 'chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent {
  username: String;
  password: String;

  constructor(private _loginService: LoginService) {
    this.username = 'test';
    this.password = 'pass';
    _loginService.login(this.username, this.password).subscribe(
      (res) => {
        console.log(res);
      },
      (err: Error) => {
        console.error('Error logging in');
      }
    );
  }

}
