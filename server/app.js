const express = require('express');
const routes = require('~/handlers');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  next();
});

app.use('/metadata', routes.metadata);
app.use('/video', routes.video);
app.use('/videos', routes.videos);

app.listen(3000, () => {
  console.log('Server running on 3000');
});
