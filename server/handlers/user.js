const handler = require('express').Router();
const _ = require('lodash');
const db = require('~/helpers/databaseManager');
const authenticationHelper = require('~/helpers/authenticationHelper');
const ErrorHelper = require('~/helpers/errorHelper');

handler.get('/:username', (req, res, next) => {
  const username = req.params.username;

  db.getUser(username)
    .then((user) => {
      if(_.isNull(user)) {
        next(new ErrorHelper({
          message: `User ${username} not found.`,
          status: 404
        }));
      } else {
        res.status(200).json(user);
      }
    });
});

handler.post('/', (req, res, next) => {
  const user = req.body.user;

  if(_.isNil(user) || _.isNil(user.username) || _.isNil(user.password)) {
    next(new ErrorHelper({
      message: `Bad request. Username/password missing.`,
      status: 400
    }));
  } else {
    authenticationHelper.hashPassword(user.password)
      .then((hash) => db.createUser({ username: user.username, password: hash }))
      .then(() => res.status(200).send())
      .catch((err) => {
        if(err.status === 409) {
          next(new ErrorHelper({
            message: `User ${user.username} already exists.`,
            status: 409
          }));
        } else {
          next(new ErrorHelper({
            message: `Failed to create user.`,
            status: 500
          }));
        }
      });
  }
});

module.exports = handler;
