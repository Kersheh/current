const _ = require('lodash');
const router = require('express').Router();
const db = require('~/helpers/databaseClient');

router.get('/', (req, res) => {
  const videosList = db.getVideos();
  let videos, status;

  if(_.isNull(videosList)) {
    videos = [];
    status = 500;
  } else {
    videos = _.map(videosList, (video) => _.pick(video, ['id', 'name', 'type']));
    status = videos.length > 0 ? 200 : 204;
  }

  res.status(status).json(videos);
});

module.exports = router;
