/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { VideoComponent } from './video.component';

describe('VideoComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        VideoComponent
      ],
    });
    TestBed.compileComponents();
  });

  it('should create the video component', async(() => {
    const fixture = TestBed.createComponent(VideoComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
