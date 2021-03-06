const _ = require('lodash');
const path = require('path');
const crc = require('crc');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const ErrorHelper = require('./errorHelper');
const db = require('./databaseManager');

const VIDEOS_DIR = path.join(__dirname, '../videos');

function readVideoFiles() {
  let videos = [];

  return fs.readdirAsync(VIDEOS_DIR)
    .then((files) => {
      _.each(files, file => {
        if(validFileName(file)) {
          videos.push(videoModel(file));
        }
      });
      return videos;
    }).catch(() => {
      throw new ErrorHelper({
        message: `Video path ${VIDEOS_DIR} not found`,
        status: 500,
        level: 1
      });
    });
}

function streamVideo(id, range) {
  return db.getVideo(id).then((video) => {
    let filePath;

    return new Promise((resolve) => {
      if(_.isUndefined(video)) {
        throw new ErrorHelper({
          message: `Request for video id '${id}' not found`,
          status: 404
        });
      }

      filePath = path.join(VIDEOS_DIR, `${video.name}.${video.type}`);
      resolve();
    }).then(() => fs.statAsync(filePath))
      .catch((err) => {
        if(_.isUndefined(err.status)) {
          throw new ErrorHelper({
            message: `Video id '${id}' exists but file not found!`,
            status: 500,
            level: 1
          });
        } else {
          throw err;
        }
      }).then((stat) => {
        let stream, head, status;
        const fileSize = stat.size;

        if(range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunkSize = (end - start) + 1;

          head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': `video/${video.type}`
          };
          stream = fs.createReadStream(filePath, { start, end });
          status = 206;
        } else {
          head = {
            'Content-Length': fileSize,
            'Content-Type': `video/${video.type}`
          };
          stream = fs.createReadStream(filePath);
          status = 200;
        }

        return({ head, stream, status });
      });
  });
}

function hashFileName(name) {
  return crc.crc32(name).toString(16);
}

function validFileName(file) {
  return /^[^.][\w\s[\].-]+[^.]$/i.test(file);
}

function videoModel(file) {
  const fileSplit = file.split('.');
  return {
    id: hashFileName(fileSplit[0]),
    name: fileSplit.slice(0, -1).toString(),
    type: fileSplit[fileSplit.length - 1]
  };
}

module.exports = {
  readVideoFiles,
  streamVideo,
  hashFileName,
  validFileName,
  videoModel
};
