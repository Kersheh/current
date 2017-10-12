const _ = require('lodash');
const Promise = require('bluebird');
const ErrorHelper = require('~/helpers/errorHelper');
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

    resolve(metadata);
  });
}

module.exports = {
  getMetadata
};
