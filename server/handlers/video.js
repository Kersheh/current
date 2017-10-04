const router = require('express').Router();
const fileHelper = require('~/helpers/fileHelper');
const logger = require('~/helpers/logHelper');

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const range = req.headers.range || 0;

  fileHelper.streamVideo(id, range)
    .then((video) => {
      res.writeHead(video.status, video.head);
      video.stream.pipe(res);
    }).catch((err) => {
      logger.log(err);
      res.status(404);
      res.send();
    });
});

module.exports = router;
