const _ = require('lodash');
const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const VIDEOS_PATH = path.join(__dirname, '../cache');

router.get('/', (req, res) => {
  let videos = [];
  fs.readdir(VIDEOS_PATH, (err, files) => {
    if (err) {
      res.status(500).send({ error: 'Something failed!' });
    } else {
      _.each(files, file => {
        videos.push(file);
      });
      res.send(videos);
    }
  });
});

module.exports = router;
