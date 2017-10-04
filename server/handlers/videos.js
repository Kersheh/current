const _ = require('lodash');
const router = require('express').Router();
const fileHelper = require('~/helpers/fileHelper')

router.get('/', (req, res) => {
  let videos = fileHelper.getListOfVideos();

  switch(videos) {
    case _.isNull(videos):
      res.status(500);
      videos = [];
      break;
    case videos.length > 0:
      res.status(200);
      break;
    case videos.length === 0:
      res.status(204);
      break;
  }

  res.send(videos);
});

module.exports = router;
