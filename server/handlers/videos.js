const _ = require('lodash');
const router = require('express').Router();
const fileHelper = require('~/helpers/fileHelper');

router.get('/', (req, res) => {
  let videos = fileHelper.getListOfVideos();
  let status;

  if(_.isNull(videos)) {
    videos = [];
    status = 500;
  } else {
    status = videos.length > 0 ? 200 : 204;
  }

  res.status(status).json(videos);
});

module.exports = router;
