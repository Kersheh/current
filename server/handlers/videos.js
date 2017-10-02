const router = require('express').Router();
const fileHelper = require('../helpers/fileHelper')

router.get('/', (req, res) => {
  const videos = fileHelper.getListOfVideos();
  if(videos.length > 0) {
    res.status(200);
  } else {
    res.status(204);
  }
  res.send(videos);
});

module.exports = router;
