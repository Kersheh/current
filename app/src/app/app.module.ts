import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { VideoListComponent } from './components/video-list/video-list.component';
import { VideoComponent } from './components/video/video.component';

import { VideoService } from './shared/video.service';

@NgModule({
  declarations: [
    AppComponent,
    VideoListComponent,
    VideoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [VideoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
