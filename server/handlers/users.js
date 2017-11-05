const _ = require('lodash');
const handler = require('express').Router();
const db = require('../helpers/databaseManager');

handler.get('/', (req, res, next) => {
  db.getUsers().then((users) => {
    const status = _.isEmpty(users) ? 204 : 200;

    res.status(status).json(users);
  });
});

module.exports = handler;
