const _ = require('lodash');
const handler = require('express').Router();
const db = require('~/helpers/databaseClient');

handler.get('/', (req, res) => {
  db.getVideos().then((videos) => {
    const status = _.isEmpty(videos) ? 204 : 200;

    res.status(status).json(videos);
  });
});

module.exports = handler;
