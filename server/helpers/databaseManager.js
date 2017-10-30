const _ = require('lodash');
const config = require('config');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const ErrorHelper = require('~/helpers/errorHelper');
const models = require('~/models');

const DB_URL = config.get('DATABASE.URL');
mongoose.Promise = Promise;

class DatabaseManager {
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

  createVideo(video) {
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

  getVideos() {
    return models.Video.find({}, '-_id id name type');
  }

  /*
   * User database calls
   */

  createUser(user) {
    return models.User.create(user)
      .catch(() => {
        throw new ErrorHelper({
          message: `User ${user.username} already exists.`,
          status: 409
        })
      });
  }

  getUser(username) {
    return models.User.findOne({ 'username': username }, '-_id username admin');
  }

  getUserPassword(username) {
    return models.User.findOne({ 'username': username }, '-_id username password admin');
  }

  removeUser(username) {
    return models.User.findOne({ 'username': username }, '-_id username admin')
      .then((user) => {
        if(!_.isNull(user)) {
          return user.remove();
        } else {
          throw new ErrorHelper({
            message: `User ${username} not found.`,
            status: 404
          });
        }
      });
  }

  getUsers() {
    return models.User.find({}, '-_id username admin');
  }

  /*
   * Session database calls
   */

  storeSession(session) {
    return models.Session.findOne({ 'sessionID': session.sessionID }, '-_id')
      .then((oldSession) => {
        if(!_.isNull(oldSession)) {
          return models.Session.update({ 'sessionID': session.sessionID }, { 'cookie': session.cookie });
        }
        return models.Session.create(session);
      });
  }

  removeSession(username) {
    return models.Session.findOne({ 'username': username })
      .then((session) => {
        if(!_.isNull(session)) {
          return session.remove();
        } else {
          throw new ErrorHelper({
            message: `Session for user ${username} not found.`,
            status: 404
          })
        }
      });
  }

  getSession(sessionID) {
    return models.Session.findOne({ 'sessionID': sessionID });
  }
}

module.exports = new DatabaseManager(DB_URL);
