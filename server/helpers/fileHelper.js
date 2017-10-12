const _ = require('lodash');
const path = require('path');
const watch = require('node-watch');
const crc = require('crc');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const ErrorHelper = require('~/helpers/errorHelper');
const db = require('~/helpers/tempDatabase');

const VIDEOS_DIR = path.join(__dirname, '../videos');

class FileHelper {
  constructor(path) {
    this.path = path;
    this._readVideoFiles()
      .then(() => this._watchVideoFolder())
      .catch(() => console.log('\x1b[31m', 'SEVERE ERROR: Server restart required.'));
  }

  _watchVideoFolder() {
    watch(this.path, { recursive: false }, (evt, name) => {
      this._readVideoFiles();
    });
  }

  _readVideoFiles() {
    let videos = [];

    return fs.readdirAsync(this.path)
      .then((files) => {
        _.each(files, file => {
          if(_validFileName(file)) {
            let fileSplit = file.split('.');
            videos.push({
              id: crc.crc32(fileSplit[0]).toString(16),
              name: fileSplit.slice(0, -1).toString(),
              type: fileSplit[fileSplit.length - 1]
            });
          }
        });
        db.videos = videos;
      }).catch(() => {
        db.videos = null;
        throw new ErrorHelper({
          message: `Video path ${VIDEOS_DIR} not found`,
          status: 500,
          level: 1
        });
      });
  }

  getListOfVideos() {
    return db.videos;
  }

  streamVideo(id, range = 0) {
    let video = _.find(db.videos, (video) => { return video.id === id; });
    let filePath;

    return new Promise((resolve) => {
      if(_.isUndefined(video)) {
        throw new ErrorHelper({
          message: `Request for video id '${id}' not found`,
          status: 404
        });
      }

      filePath = `${this.path}/${video.name}.${video.type}`;
      resolve();
    }).then(() => fs.statAsync(filePath))
      .catch((err) => {
        if(_.isUndefined(err.status)) {
          throw new ErrorHelper({
            message: `Video id '${id}' exists but file not found!`,
            status: 500,
            level: 1
          });
        }
      })
      .then((stat) => {
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
  }
}

function _validFileName(file) {
  return /^[^.][\w\s[\].-]+[^.]$/i.test(file);
}

module.exports = new FileHelper(VIDEOS_DIR);
