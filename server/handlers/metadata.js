const router = require('express').Router();
const metadataHelper = require('~/helpers/metadataHelper');
const ffmpegHelper = require('~/helpers/ffmpegHelper');

router.get('/:id', (req, res) => {
  const id = req.params.id;

  // test
  ffmpegHelper.getVideoThumbnail(id);

  metadataHelper.getMetadata(id)
    .then((metadata) => {
      res.status(200).send(metadata);
    }).catch(() => {
      res.status(404).send();
    });
});

module.exports = router;
