const metadataHelper = require('~/helpers/metadataHelper');

function socket(io) {
  io.namespace('metadata').on('connect', (socket) => {
    socket.on('getMetadata', (id) => {
      metadataHelper.getMetadata(id)
        .then((metadata) => socket.emit('data', metadata));
    });
  });
}

module.exports = socket;
