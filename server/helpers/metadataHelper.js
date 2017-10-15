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

    ffmpegHelper.getVideoThumbnail(id)
      .then((data) => {
        _.assign(metadata, {
          thumbnail: {
            img: data,
            contentType: 'image/png'
          }
        });
        resolve(metadata);
      });
  });
}

module.exports = {
  getMetadata
};
