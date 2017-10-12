const router = require('express').Router();
const metadataHelper = require('~/helpers/metadataHelper');

router.get('/:id', (req, res) => {
  const id = req.params.id;

  metadataHelper.getMetadata(id)
    .then((metadata) => {
      res.status(200).send(metadata);
    }).catch(() => {
      res.status(404).send();
    });
});

module.exports = router;
