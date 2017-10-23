const db = require('~/helpers/databaseHelper');

function socket(io) {
  const namespace = io.namespace('metadata');
  namespace.on('connect', (socket) => {
    socket.on('getMetadata', (id) => {
      db.getVideo(id)
        .then((metadata) => socket.emit('data', metadata))
        .catch(() => {
          socket.emit('err', {
            msg: `Failed to fetch metadata of video id '${id}'`
          });
        });
    });
  });
}

module.exports = socket;
