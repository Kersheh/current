const _ = require('lodash');
const path = require('path');
const watch = require('node-watch');
const Promise = require('bluebird');
const fileHelper = require('~/helpers/fileHelper');
const ffmpegHelper = require('~/helpers/ffmpegHelper');
const db = require('~/helpers/databaseClient');

const VIDEOS_DIR = path.join(__dirname, '../videos');

/*
 * Synchronize video library and watcher with database;
 * to be executed on server start up.
 */

function syncVideoLibrary() {
  return fileHelper.readVideoFiles()
    .then((videos) => {
      return _.each(videos, (video) => {
        db.createVideo(video.id, video);
      });
    }).then(() => {
      return _.each(db.getVideos(), (video) => {
        buildVideoInfo(video.id);
      });
    }).then(() => {
      watch(VIDEOS_DIR, { recursive: false }, (event, name) => {
        const file = path.basename(name);

        if(event === 'update') {
          if(fileHelper.validFileName(file)) {
            const video = fileHelper.videoModel(file);
            db.createVideo(video.id, video);
            buildVideoInfo(video.id);
          }
        }

        if(event === 'remove') {
          db.removeVideo(fileHelper.hashFileName(file.split('.')[0]));
        }
      });
    }).catch((err) => {
      throw err;
    });
}

function buildVideoInfo(id) {
  return Promise.all([
    ffmpegHelper.getVideoMetadata(id),
    ffmpegHelper.getVideoThumbnail(id)
  ]).spread((metadata, thumbnail) => {
    db.updateVideo(id, {
      metadata: metadata,
      thumbnail: thumbnail
    });
  });
}

module.exports = {
  syncVideoLibrary
};
