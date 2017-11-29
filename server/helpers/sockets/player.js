const VideoManager = require('../videoManager');
const authenticationHelper = require('../authenticationHelper');

function socket(io) {
  const namespace = io.namespace('player');
  const player = new VideoManager();

  namespace.on('connect', (socket) => {
    authenticationHelper.authenticateSocket(socket, () => {
      socket.on('play', () => {
        if(!player.getPlayerState().playing) {
          player.play();
          updateClients(socket, player);
        }
      });

      socket.on('pause', () => {
        if(player.getPlayerState().playing) {
          player.pause();
          updateClients(socket, player);
        }
      });

      // TODO: Handle bad time param
      socket.on('changeTime', (time) => {
        player.changeTime(time);
        updateClients(socket, player);
      });

      // TODO: Handle bad id param
      socket.on('changeVideo', (id) => {
        player.changeVideo(id);
        updateClients(socket, player);
      });
    });
  });
}

function updateClients(socket, player) {
  socket.broadcast.emit('playerUpdate', player.getPlayerState());
}

module.exports = socket;
