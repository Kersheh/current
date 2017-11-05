const _ = require('lodash');
const db = require('../databaseManager');

function socket(io) {
  const namespace = io.namespace('metadata');

  namespace.on('connect', (socket) => {
    socket.on('getMetadata', (id) => {
      db.getVideoAllData(id).then((metadata) => {
        if(_.isNull(metadata)) {
          socket.emit('err', {
            message: `Failed to fetch metadata of video id '${id}'`
          });
        } else {
          socket.emit('data', metadata)
        }
      });
    });
  });
}

module.exports = socket;
