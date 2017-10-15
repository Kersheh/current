const _ = require('lodash');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const ErrorHelper = require('~/helpers/errorHelper');
const db = require('~/helpers/tempDatabase');

const VIDEOS_DIR = path.join(__dirname, '../videos');
const TEMP_DIR = path.join(__dirname, '../temp');

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

    return ffmpeg(path)
      .screenshots({
        timestamps: ['50%'],
        size: '356x200',
        folder: TEMP_DIR,
        filename: `/${id}.png`
      }).on('error', () => {
        throw new ErrorHelper({
          message: `Failed to capture screenshot of file ${video.name}.${video.type}`,
          status: 500
        });
      }).on('end', () => {
        fs.readFileAsync(`${TEMP_DIR}/${id}.png`)
          .then((img) => resolve(img));
      });
  });
}

module.exports = {
  getVideoThumbnail
};
