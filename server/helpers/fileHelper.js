const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const watch = require('node-watch');
const crc = require('crc');

const VIDEOS_PATH = path.join(__dirname, '../videos');

class FileHelper {
  constructor(path) {
    this.path = path;
    this.videos = [];
    this._readVideoFiles();
    this._watchVideoFolder();
  }

  _watchVideoFolder() {
    watch(this.path, { recursive: true }, (evt, name) => {
      this._readVideoFiles();
    });
  }

  _readVideoFiles() {
    let videos = [];
    fs.readdir(this.path, (err, files) => {
      if(err) {
        throw new Error({ error: 'Something failed!' });
      } else {
        _.each(files, file => {
          videos.push({
            id: crc.crc32(file.split('.')[0]).toString(16),
            name: file.split('.')[0],
            ext: file.split('.')[1]
          });
        });
        this.videos = videos;
      }
    });
  }

  getListOfVideos() {
    return this.videos;
  }

  streamVideo(id, range = 0) {
    let video, file, head, status;
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
      file = fs.createReadStream(filePath, { start, end });
      status = 206;
    } else {
      head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/' + video.ext
      };
      file = fs.createReadStream(filePath);
      status = 200;
    }
    return { head, file, status };
  }
}

module.exports = new FileHelper(VIDEOS_PATH);
