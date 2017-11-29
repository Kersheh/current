const _ = require('lodash');
const socketIO = require('socket.io');
const sockets = require('./sockets');

class SocketManager {
  init(server, sessionMiddleware) {
    this.io = socketIO(server, {
      serveClient: false
    });
    this.io.use((socket, next) => {
      sessionMiddleware(socket.request, socket.request.res, next);
    });
    _.each(sockets, (socket) => socket(this));
  }

  namespace(namespace) {
    return this.io.of(`/socket/${namespace}`);
  }
}

module.exports = new SocketManager();
