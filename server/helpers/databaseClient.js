const _ = require('lodash');
const config = require('config');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const ErrorHelper = require('~/helpers/errorHelper');
const db = require('~/helpers/tempDatabase'); // TODO: Remove temp database

const DB_URL = config.get('Database.url');
mongoose.Promise = Promise;

class DatabaseClient {
  constructor(url) {
    this.mongoPromise = this.connect(url)
      .catch(() => {
        console.log('\x1b[31m', 'SEVERE ERROR: Server restart required.');
      });
  }

  connect(url) {
    return mongoose.connect(url, { useMongoClient: true })
      .catch(() => {
        throw new ErrorHelper({
          message: `Failed to connect database to ${url}.`,
          status: 500,
          level: 1
        });
      });
  }

  // TODO: Implement with Mongo
  createVideo(id, video) {
    if(!_.find(db.videos, (video) => { return video.id === id; })) {
      db.videos.push(video);
    }
  }

  // TODO: Implement with Mongo
  getVideo(id) {
    return new Promise((resolve) => {
      let video = _.find(db.videos, (video) => { return video.id === id; });

      if(_.isUndefined(video)) {
        throw new ErrorHelper({
          message: `Request for video id '${id}' not found`,
          status: 404
        });
      }
      resolve(video);
    });
  }

  // TODO: Implement with Mongo
  updateVideo(id, prop) {
    const video = _.find(db.videos, (video) => { return video.id === id; });
    if(video) {
      _.extend(video, prop);
    }
  }

  // TODO: Implement with Mongo
  removeVideo(id) {
    _.remove(db.videos, (video) => { return video.id === id; });
  }

  // TODO: Implement with Mongo
  getVideos(videos) {
    return db.videos;
  }
}

module.exports = new DatabaseClient(DB_URL);
