class VideoManager {
  constructor() {
    this.id = null;
    this.duration = null;
    this.timestamp = 0;
    this.playing = false;
    this.player = null;
  }

  play() {
    const ctrl = this;
    if(!ctrl.playing) {
      ctrl.playing = true;
      ctrl.player = setInterval(() => {
        ctrl.timestamp += 1;
        if(ctrl.timestamp >= ctrl.duration) {
          ctrl.playing = false;
          clearInterval(this);
        }
      }, 1000);
    }
  }

  pause() {
    if(this.playing) {
      this.playing = false;
      clearInterval(this.player);
    }
  }

  changeTime(timestamp) {
    this.timestamp = timestamp;
  }

  changeVideo(id, duration) {
    this.pause();
    this.id = id;
    this.duration = duration;
    this.timestamp = 0;
    this.play();
  }

  getPlayerState() {
    return {
      id: this.id,
      timestamp: this.timestamp,
      playing: this.playing
    };
  }
}

module.exports = new VideoManager();
