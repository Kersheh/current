const express = require('express');
const _ = require('lodash');
const routes = require('./handlers');
const app = express();

_.each(routes, (route) => {
  _.each(route, (crud) => {
    app.use('/', crud);
  });
});

app.listen(3000, () => {
  console.log('Server running on 3000');
});
