const path = require('path');
const moment = require('moment');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const LOG_DIR = path.join(__dirname, '../log');

function _writeLog(log) {
  const date = moment().format('YYYY-MM-DD');
  const time = moment().format('h:mm:ss a');
  const message = `[${time}] Status: ${log.status} | Message: ${log.message}\n`;

  fs.appendFileAsync(`${LOG_DIR}/${date}.log`, message);
  const color = log.level ? '\x1b[31m' : '\x1b[33m';
  console.log(color, message);
}

function log(msg) {
  const log = {
    message: msg.message,
    status: msg.status,
    level: msg.level || false
  };

  return fs.statAsync(LOG_DIR)
    .catch(() => fs.mkdirAsync(LOG_DIR))
    .finally(() => _writeLog(log));
}

module.exports = {
  log
};
