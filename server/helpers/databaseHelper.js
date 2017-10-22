const _ = require('lodash');
const Promise = require('bluebird');
const ErrorHelper = require('~/helpers/errorHelper');
const db = require('~/helpers/tempDatabase');

function getVideo(id) {
  return new Promise((resolve) => {
    let video = _.find(db.videos, (video) => { return video.id === id; });

    if(_.isUndefined(video)) {
      throw new ErrorHelper({
        message: `Request for video id '${id}' not found`,
        status: 404
      });
    }
    resolve(video);
  });
}

function createVideo(id, video) {
  if(!_.find(db.videos, (video) => { return video.id === id; })) {
    db.videos.push(video);
  }
}

function updateVideo(id, prop) {
  const video = _.find(db.videos, (video) => { return video.id === id; });
  if(video) {
    _.extend(video, prop);
  }
}

function removeVideo(id) {
  _.remove(db.videos, (video) => { return video.id === id; });
}

function getVideos(videos) {
  return db.videos;
}

module.exports = {
  getVideo,
  createVideo,
  updateVideo,
  removeVideo,
  getVideos
};
