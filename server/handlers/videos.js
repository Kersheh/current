const router = require('express').Router();
const fileHelper = require('../helpers/fileHelper')

router.get('/', (req, res) => {
  const videos = fileHelper.getListOfVideos();
  const status = videos.length > 0 ? 200 : 204;

  res.status(status);
  res.send(videos);
});

module.exports = router;
