const _ = require('lodash');
const handler = require('express').Router();
const db = require('../helpers/databaseManager');
const authenticationHelper = require('../helpers/authenticationHelper');
const ErrorHelper = require('../helpers/errorHelper');

handler.post('/login', (req, res, next) => {
  const user = req.body.user;

  if(_.isNil(user) || _.isNil(user.username) || _.isNil(user.password)) {
    next(new ErrorHelper({
      message: 'Username/password not given.',
      status: 400
    }));
  } else {
    authenticationHelper.comparePassword(user.password, user.username)
      .then((auth) => {
        if(!auth) {
          throw new ErrorHelper({
            message: 'Incorrect password.',
            status: 400
          });
        } else {
          return db.storeSession({
            username: user.username,
            sessionID: req.sessionID,
            cookie: req.session.cookie
          }).then(() => res.status(200).send());
        }
      }).catch((err) => {
        next(err);
      });
  }
});

handler.post('/logout', (req, res, next) => {
  const sessionID = req.sessionID;

  db.removeSession(sessionID)
    .then(() => {
      if(!_.isUndefined(req.session)) {
        req.session.destroy();
      }
      res.status(200).send();
    }).catch((err) => {
      next(new ErrorHelper({
        message: err.message,
        status: err.status
      }));
    });
});

handler.post('/', (req, res, next) => {
  authenticationHelper.authenticate(req, res, (auth) => {
    const status = _.isUndefined(auth) ? 200 : 401;
    res.status(status).send();
  });
});

module.exports = handler;
