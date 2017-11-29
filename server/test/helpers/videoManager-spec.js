const VideoManager = require('../../helpers/videoManager');

describe('videoManager unit tests', () => {
  let player, playerState;
  const VIDEO = 'randomVideoId';
  const VIDEO_LENGTH = 100;

  beforeEach(() => {
    player = new VideoManager();
  });

  afterEach(() => {
    clearInterval(player.player); // explicitly remove player interval
  });

  it('should not start player without video set', () => {
    player.play();
    playerState = player.getPlayerState();

    expect(playerState.playing).to.equal(false);
  });

  it('should autoplay player when video set', () => {
    player.changeVideo(VIDEO, VIDEO_LENGTH);
    playerState = player.getPlayerState();

    expect(playerState.id).to.equal(VIDEO);
    expect(playerState.playing).to.equal(true);
    expect(playerState.duration).to.equal(VIDEO_LENGTH);
  });

  it('should explicitly not autoplay player when video set', () => {
    player.changeVideo(VIDEO, VIDEO_LENGTH, false);
    playerState = player.getPlayerState();

    expect(playerState.id).to.equal(VIDEO);
    expect(playerState.playing).to.equal(false);
    expect(playerState.duration).to.equal(VIDEO_LENGTH);
  });

  it('should pause the video', () => {
    player.changeVideo(VIDEO, VIDEO_LENGTH);
    player.pause();
    playerState = player.getPlayerState();

    expect(playerState.id).to.equal(VIDEO);
    expect(playerState.playing).to.equal(false);
  });

  it('should change the video timestamp while playing', () => {
    player.changeVideo(VIDEO, VIDEO_LENGTH);
    player.changeTime(50);
    playerState = player.getPlayerState();

    expect(playerState.timestamp).to.equal(50);
    expect(playerState.playing).to.equal(true);
  });

  it('should reset the video', () => {
    player.changeVideo(VIDEO, VIDEO_LENGTH);
    player.changeTime(50);
    player.reset();
    playerState = player.getPlayerState();

    expect(playerState.timestamp).to.equal(0);
    expect(playerState.playing).to.equal(true);
  });
});
