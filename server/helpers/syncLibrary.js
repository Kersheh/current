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
  let videos;

  return fileHelper.readVideoFiles()
    .then((videosList) => {
      videos = videosList;
      console.log('Building database from videos folder...');
      // consider setting concurrency limit of Promise map
      return Promise.map(videos, (video) => {
        return db.createVideo(video.id, video);
      });
    }).then(() => {
      console.log('Cleaning database of missing videos from videos folder...');
      return db.getVideos().then((videosList) => {
        const videosToRemove = _.differenceBy(videosList, videos, 'id');
        return Promise.map(videosToRemove, (video) => {
          return db.removeVideo(video.id);
        });
      });
    }).then(() => {
      console.log('Building video metadata of videos in database...');
      return Promise.map(videos, (video) => {
        return buildVideoInfo(video.id);
      });
    }).then(() => {
      watch(VIDEOS_DIR, { recursive: false }, (event, name) => {
        const file = path.basename(name);

        if(event === 'update') {
          if(fileHelper.validFileName(file)) {
            const video = fileHelper.videoModel(file);
            db.createVideo(video.id, video)
              .then(() => buildVideoInfo(video.id));
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
    return db.updateVideoMetadata(id, metadata)
      .then(() => db.updateVideoThumbnail(id, thumbnail));
  });
}

module.exports = {
  syncVideoLibrary
};
