const logger = require('~/helpers/logHelper');

class ErrorHelper extends Error {
  constructor(err) {
    super();

    this.message = err.message || 'No error message given';
    this.status = err.status || 0;
    this.level = err.level || 0;

    logger.log({
      message: this.message,
      status: this.status,
      level: this.level
    });
  }
}

module.exports = ErrorHelper;
