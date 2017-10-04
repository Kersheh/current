const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const watch = require('node-watch');
const crc = require('crc');
const logger = require('~/helpers/logHelper');

const VIDEOS_DIR = path.join(__dirname, '../videos');

class FileHelper {
  constructor(path) {
    this.path = path;
    this.videos = [];
    this._readVideoFiles()
      .then(() => this._watchVideoFolder())
      .catch((err) => {
        logger.log(err, true);
      });
  }

  _watchVideoFolder() {
    watch(this.path, { recursive: true }, (evt, name) => {
      this._readVideoFiles()
        .catch((err) => {
          logger.log(err, true);
        });
    });
  }

  _readVideoFiles() {
    return new Promise((resolve, reject) => {
      let videos = [];
      fs.readdir(this.path, (err, files) => {
        if(err) {
          this.videos = null;
          reject({
            msg: 'Server restart required! Video path "' + VIDEOS_DIR + '" not found',
            status: 500
          });
        } else {
          _.each(files, file => {
            videos.push({
              id: crc.crc32(file.split('.')[0]).toString(16),
              name: file.split('.')[0],
              ext: file.split('.')[1]
            });
          });
          this.videos = videos;
          resolve();
        }
      });
    });
  }

  getListOfVideos() {
    return this.videos;
  }

  streamVideo(id, range = 0) {
    let video, stream, head, status;
    video = _.find(this.videos, (video) => { return video.id === id; });

    const filePath = this.path + '/' + video.name + '.' + video.ext;
    const stat = fs.statSync(filePath);
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
        'Content-Type': 'video/' + video.ext
      };
      stream = fs.createReadStream(filePath, { start, end });
      status = 206;
    } else {
      head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/' + video.ext
      };
      stream = fs.createReadStream(filePath);
      status = 200;
    }
    return { head, stream, status };
  }
}

module.exports = new FileHelper(VIDEOS_DIR);
