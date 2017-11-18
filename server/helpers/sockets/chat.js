const authenticationHelper = require('../authenticationHelper');

function socket(io) {
  const namespace = io.namespace('chat');

  namespace.on('connect', (socket) => {
    authenticationHelper.authenticateSocket(socket, () => {
      socket.on('message', (message) => {
        socket.broadcast.emit('message', message);
      });
    });
  });
}

module.exports = socket;
