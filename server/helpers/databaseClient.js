const config = require('config');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const ErrorHelper = require('~/helpers/errorHelper');
const models = require('~/models');

const DB_URL = config.get('DATABASE.URL');
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

  /*
   * Video database calls
   */

  createVideo(id, video) {
    return models.Video.create(video).catch(() => {}); // silence duplicate key error
  }

  getVideo(id) {
    return models.Video.findOne({ 'id': id }, '-_id id name type');
  }

  getVideoAllData(id) {
    return models.Video.findOne({ 'id': id }, '-_id id name type metadata thumbnail');
  }

  updateVideoMetadata(id, metadata) {
    return models.Video.update({ 'id': id }, { 'metadata': metadata });
  }

  updateVideoThumbnail(id, thumbnail) {
    return models.Video.update({ 'id': id }, { 'thumbnail': thumbnail });
  }

  removeVideo(id) {
    return models.Video.remove({ 'id': id }).catch(() => {}); // silence failed remove error
  }

  getVideos(videos) {
    return models.Video.find({}, '-_id id name type');
  }

  /*
   * User database calls
   */
}

module.exports = new DatabaseClient(DB_URL);
