const VideoManager = require('../videoManager');
const authenticationHelper = require('../authenticationHelper');

function socket(io) {
  const namespace = io.namespace('player');
  const player = new VideoManager();

  namespace.on('connect', (socket) => {
    authenticationHelper.authenticateSocket(socket, () => {
      socket.on('play', () => {
        player.play();
        namespace.emit('playerUpdate', player.getPlayerState());
      });

      socket.on('pause', () => {
        player.pause();
        namespace.emit('playerUpdate', player.getPlayerState());
      });

      socket.on('changeTime', (time) => {
        player.changeTime(time);
        namespace.emit('playerUpdate', player.getPlayerState());
      });

      socket.on('changeVideo', (id) => {
        player.changeVideo(id);
        namespace.emit('playerUpdate', player.getPlayerState());
      });
    });
  });
}

module.exports = socket;
