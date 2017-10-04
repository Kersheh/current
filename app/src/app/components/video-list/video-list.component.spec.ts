/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { VideoListComponent } from './list.component';

describe('VideoListComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        VideoListComponent
      ],
    });
    TestBed.compileComponents();
  });

  it('should create the video list component', async(() => {
    const fixture = TestBed.createComponent(VideoListComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
