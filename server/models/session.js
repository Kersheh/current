const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Session', new Schema({
  username: String,
  sessionID: String,
  cookie: {}
}));
