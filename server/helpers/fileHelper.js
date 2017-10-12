const _ = require('lodash');
const path = require('path');
const watch = require('node-watch');
const crc = require('crc');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const ErrorHelper = require('~/helpers/errorHelper');

const VIDEOS_DIR = path.join(__dirname, '../videos');

class FileHelper {
  constructor(path) {
    this.path = path;
    this.videos = [];
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
          if(!_.isUndefined(file.split('.')[1])) {
            // naive filename split assumes filename contains a single dot
            videos.push({
              id: crc.crc32(file.split('.')[0]).toString(16),
              name: file.split('.')[0],
              type: file.split('.')[1]
            });
          }
        });
        this.videos = videos;
      }).catch(() => {
        this.videos = null;
        throw new ErrorHelper({
          message: `Video path ${VIDEOS_DIR} not found`,
          status: 500,
          level: 1
        });
      });
  }

  getListOfVideos() {
    return this.videos;
  }

  streamVideo(id, range = 0) {
    let video = _.find(this.videos, (video) => { return video.id === id; });
    let filePath;

    return new Promise((resolve) => {
      if(_.isUndefined(video)) {
        throw new ErrorHelper({
          message: `Request for video id '${id}' not found`,
          status: 404
        });
      }

      filePath = `${this.path}/${video.name}.${video.ext}`;
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
            'Content-Type': `video/${video.ext}`
          };
          stream = fs.createReadStream(filePath, { start, end });
          status = 206;
        } else {
          head = {
            'Content-Length': fileSize,
            'Content-Type': `video/${video.ext}`
          };
          stream = fs.createReadStream(filePath);
          status = 200;
        }

        return({ head, stream, status });
      });
  }
}

module.exports = new FileHelper(VIDEOS_DIR);
