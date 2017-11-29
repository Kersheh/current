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
        return next(new ErrorHelper({
          message: 'Access denied. Session not authenticated.',
          status: 401
        }));
      } else if(_isExpired(moment(session.cookie._expires))) {
        return db.removeSession(session.sessionID)
          .then(() => {
            next(new ErrorHelper({
              message: 'Access denied. Session has expired.',
              status: 401
            }));
          });
      }

      return db.updateSession(sessionID, req.session.cookie)
        .then(() => {
          // expire old sessions
          return db.getSessionsByUsername(session.username)
            .then((sessions) => {
              return _.each(sessions, (session) => {
                if(sessionID !== session.sessionID) {
                  if(_isExpired(moment(session.cookie._expires))) {
                    db.removeSession(session.sessionID);
                  }
                }
              });
            });
        }).then(() => next());
    });
}

function authenticateSocket(socket, next) {
  const req = {
    session: socket.request.session,
    sessionID: socket.request.sessionID
  };

  authenticate(req, {}, (err) => {
    if(err) {
      socket.emit('err', {
        message: err.message
      });
      socket.disconnect();
    } else {
      next();
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

function _isExpired(expiry) {
  return expiry - moment() < 0;
}

module.exports = {
  authenticate,
  authenticateSocket,
  hashPassword,
  comparePassword,
  _isExpired
};
