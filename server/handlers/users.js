const _ = require('lodash');
const handler = require('express').Router();
const db = require('~/helpers/databaseClient');

handler.get('/', (req, res) => {
  db.getUsers().then((users) => {
    const status = _.isEmpty(users) ? 204 : 200;

    res.status(status).json(users);
  });
});

module.exports = handler;
