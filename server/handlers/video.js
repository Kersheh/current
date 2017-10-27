const handler = require('express').Router();
const fileHelper = require('~/helpers/fileHelper');

handler.get('/:id', (req, res) => {
  const id = req.params.id;
  const range = req.headers.range;

  fileHelper.streamVideo(id, range)
    .then((video) => {
      res.writeHead(video.status, video.head);
      video.stream.pipe(res);
    }).catch(() => {
      res.status(404).send();
    });
});

module.exports = handler;
