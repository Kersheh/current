const express = require('express');
const routes = require('./handlers');
const app = express();

app.use('/video', routes.video);
app.use('/videos', routes.videos);

app.listen(3000, () => {
  console.log('Server running on 3000');
});
