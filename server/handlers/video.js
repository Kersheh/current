const handler = require('express').Router();
const fileHelper = require('../helpers/fileHelper');
const ErrorHelper = require('../helpers/errorHelper');

handler.get('/:id', (req, res, next) => {
  const id = req.params.id;
  const range = req.headers.range;

  fileHelper.streamVideo(id, range)
    .then((video) => {
      res.writeHead(video.status, video.head);
      video.stream.pipe(res);
    }).catch(() => {
      next(new ErrorHelper({
        message: `Video id ${id} not found.`,
        status: 404
      }));
    });
});

module.exports = handler;
