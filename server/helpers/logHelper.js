const fs = require('fs');
const path = require('path');
const moment = require('moment');

const LOG_DIR = path.join(__dirname, '../log');

function _validateLogDir() {
  if(!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
  }
}

function _writeLog(log) {
  const date = moment().format('YYYY-MM-DD');
  const time = moment().format('h:mm:ss a');
  const msg = `[${time}] Status: ${log.status} | Msg: ${log.msg}\n`;

  fs.appendFile(`${LOG_DIR}/${date}.log`, msg, (err) => {
    if(err) {
      throw new Error(`Failed to write to log ${LOG_DIR}/${date}.log`);
    }
  });

  const color = log.err ? '\x1b[31m' : '\x1b[33m';
  console.log(color, msg);
}

function log(msg) {
  const log = {
    msg: msg.msg,
    status: msg.status,
    err: msg.err || false
  };
  _validateLogDir();
  _writeLog(log);
}

module.exports = {
  log
};
