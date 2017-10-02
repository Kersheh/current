const router = require('express').Router();
const fileHelper = require('../helpers/fileHelper')

router.get('/', (req, res) => {
  res.send(fileHelper.getListOfVideos());
});

module.exports = router;
