const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const watch = require('node-watch');

const VIDEOS_PATH = path.join(__dirname, '../videos');

class FileHelper {
  constructor() {
    this.videos = [];
    this._readVideoFiles();
    this._watchVideoFolder();
  }

  _watchVideoFolder() {
    watch(VIDEOS_PATH, { recursive: true }, (evt, name) => {
      this._readVideoFiles();
    });
  }

  _readVideoFiles() {
    let videos = [];
    fs.readdir(VIDEOS_PATH, (err, files) => {
      if (err) {
        throw new Error({ error: 'Something failed!' });
      } else {
        _.each(files, (file, i) => {
          videos.push({ 'id': i, 'name': file });
        });
        this.videos = videos;
      }
    });
  }

  getListOfVideos() {
    return this.videos;
  }
}

module.exports = new FileHelper();
