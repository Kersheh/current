const express = require('express');
const routes = require('./handlers');
const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/video', routes.video);
app.use('/videos', routes.videos);

app.listen(3000, () => {
  console.log('Server running on 3000');
});
