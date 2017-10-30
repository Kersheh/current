const _ = require('lodash');
const handler = require('express').Router();
const db = require('~/helpers/databaseManager');

handler.get('/', (req, res, next) => {
  db.getVideos().then((videos) => {
    const status = _.isEmpty(videos) ? 204 : 200;

    res.status(status).json(videos);
  });
});

module.exports = handler;
