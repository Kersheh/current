const fs = require('fs');
const moment = require('moment');

const LOG_DIR = './log';

function validateLogDir() {
  if(!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
  }
}

function writeLog(log) {
  const date = moment().format('YYYY-MM-DD');
  const time = moment().format('h:mm:ss a');
  fs.appendFile(`${LOG_DIR}/${date}.log`, `[${time}] Status: ${log.status} | Msg: ${log.msg}\n`, (err) => {
    if(err) {
      throw new Error(`Failed to write to log ${LOG_DIR}/${date}.log`);
    }
  });
}

function log(msg) {
  const log = {
    msg: msg.msg,
    status: msg.status
  };
  validateLogDir();
  writeLog(log);
}

module.exports = {
  log
};
