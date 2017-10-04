const router = require('express').Router();
const fileHelper = require('~/helpers/fileHelper');

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const range = req.headers.range || 0;

  let stream = fileHelper.streamVideo(id, range);
  res.writeHead(stream.status, stream.head);
  stream.file.pipe(res);
});

module.exports = router;
