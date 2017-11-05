const _ = require('lodash');
const moment = require('moment');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcryptjs'));
const db = require('./databaseManager');
const ErrorHelper = require('./errorHelper');

const SALT_ROUNDS = 10;

function authenticate(req, res, next) {
  const sessionID = req.sessionID;

  db.getSession(sessionID)
    .then((session) => {
      if(_.isNull(session)) {
        next(new ErrorHelper({
          message: 'Access denied. Session not authenticated.',
          status: 401
        }));
      } else {
        const expiry = moment(session.cookie._expires);
        if(expiry - moment() < 0) {
          db.removeSession(session.username)
            .then(() => {
              next(new ErrorHelper({
                message: 'Access denied. Session has expired.',
                status: 401
              }));
            });
        } else {
          next();
        }
      }
    });
}

function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

function comparePassword(input, username) {
  return db.getUserPassword(username)
    .then((user) => {
      if(_.isEmpty(user)) {
        throw new ErrorHelper({
          message: `Request for username '${username}' not found.`,
          status: 404
        });
      }
      return bcrypt.compare(input, user.password);
    });
}

module.exports = {
  authenticate,
  hashPassword,
  comparePassword
}
