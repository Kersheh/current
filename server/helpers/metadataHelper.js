const _ = require('lodash');
const Promise = require('bluebird');
const ErrorHelper = require('~/helpers/errorHelper');
const ffmpegHelper = require('~/helpers/ffmpegHelper');
const db = require('~/helpers/tempDatabase');

function getMetadata(id) {
  return new Promise((resolve) => {
    let metadata = _.find(db.videos, (video) => { return video.id === id; });

    if(_.isUndefined(metadata)) {
      throw new ErrorHelper({
        message: `Request for video id '${id}' not found`,
        status: 404
      });
    }

    // TODO: Build thumbnails on server start and store in db instead of
    // building thumbnails every metadata request
    ffmpegHelper.getVideoThumbnail(id)
      .then((thumbnail) => {
        _.assign(metadata, { thumbnail: thumbnail });
        resolve(metadata);
      })
      .catch(() => {
        _.assign(metadata, { thumbnail: null });
        resolve(metadata);
      })
  });
}

module.exports = {
  getMetadata
};
