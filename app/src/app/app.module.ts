import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { VideoListComponent } from './components/video-list/video-list.component';
import { VideoComponent } from './components/video/video.component';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';

import { VideoService } from './shared/video.service';
import { LoginService } from './shared/login.service';

@NgModule({
  declarations: [
    AppComponent,
    VideoListComponent,
    VideoComponent,
    ChatBoxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    VideoService,
    LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
