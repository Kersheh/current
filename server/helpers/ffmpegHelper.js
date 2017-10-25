const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const ErrorHelper = require('~/helpers/errorHelper');
const db = require('~/helpers/databaseClient');

const VIDEOS_DIR = path.join(__dirname, '../videos');
const TEMP_DIR = path.join(__dirname, '../temp');
const THUMBNAIL_SIZE = '356x200';

function getVideoThumbnail(id) {
  return new Promise((resolve) => {
    return db.getVideo(id)
      .then((video) => {
        let filePath = path.join(VIDEOS_DIR, `${video.name}.${video.type}`);

        ffmpeg(filePath)
          .screenshots({
            timestamps: ['10%'],
            size: THUMBNAIL_SIZE,
            folder: TEMP_DIR,
            filename: `${id}.png`
          }).on('error', () => {
            throw new ErrorHelper({
              message: `Failed to capture screenshot of file ${video.name}.${video.type}`,
              status: 500
            });
          }).on('end', () => {
            fs.readFileAsync(path.join(TEMP_DIR, `${id}.png`))
              .then((data) => {
                resolve({
                  img: data,
                  contentType: 'image/png',
                  size: THUMBNAIL_SIZE
                });
              });
          });
      });
  });
}

function getVideoMetadata(id) {
  return db.getVideo(id)
    .then((video) => {
      let filePath = path.join(VIDEOS_DIR, `${video.name}.${video.type}`);

      return Promise.promisify(ffmpeg.ffprobe)(filePath)
        .then((data) => _createMetadata(data))
        .catch(() => {
          throw new ErrorHelper({
            message: `Failed to read file ${filePath}`,
            status: 500
          });
        });
    });
}

// TODO: Structure metadata object
function _createMetadata(data) {
  return data;
}

module.exports = {
  getVideoThumbnail,
  getVideoMetadata
};
