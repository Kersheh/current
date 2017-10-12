const _ = require('lodash');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const Promise = require('bluebird');
const ErrorHelper = require('~/helpers/errorHelper');
const db = require('~/helpers/tempDatabase');

const VIDEOS_DIR = path.join(__dirname, '../videos');

function getVideoThumbnail(id) {
  return new Promise((resolve) => {
    let video = _.find(db.videos, (video) => { return video.id === id; });

    if(_.isUndefined(video)) {
      throw new ErrorHelper({
        message: `Request for video id '${id}' not found`,
        status: 404
      });
    }

    let path = `${VIDEOS_DIR}/${video.name}.${video.type}`;
    resolve(path);
  }).then((path) => {
    ffmpeg(path)
      .output(`${VIDEOS_DIR}/screenshot.png`)
      .noAudio()
      .seek('0:01')
      .on('error', function(err) {
        console.log('An error occurred: ' + err.message);
      })
      .on('end', function() {
        console.log('Processing finished !');
      })
      .run();
  });
}

module.exports = {
  getVideoThumbnail
};
