const _ = require('lodash');
const socketIO = require('socket.io');
const sockets = require('./sockets');

// TODO: Singleton client
class SocketManager {
  constructor(server) {
    this.io = socketIO(server);
    _.each(sockets, (socket) => socket(this));
  }

  namespace(namespace) {
    return this.io.of(`/socket/${namespace}`);
  }
}

module.exports = SocketManager;
