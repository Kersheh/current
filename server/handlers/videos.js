const _ = require('lodash');
const handler = require('express').Router();
const db = require('~/helpers/databaseClient');

handler.get('/', (req, res) => {
  db.getVideos().then((videosList) => {
    const videos = videosList;
    const status = _.isEmpty(videosList) ? 204 : 200;

    res.status(status).json(videos);
  });
});

module.exports = handler;
