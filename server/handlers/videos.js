const _ = require('lodash');
const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const VIDEOS_PATH = '../cache';

router.get('/', (req, res) => {
  let videos = [];
  fs.readdir(path.join(__dirname, VIDEOS_PATH), (err, files) => {
    _.each(files, file => {
      videos.push(file);
    });
    res.send(videos);
  });
});

module.exports = router;
