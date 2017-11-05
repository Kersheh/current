const logger = require('./logHelper');

class ErrorHelper extends Error {
  constructor(err) {
    super();

    this.message = err.message || 'Server error occurred.';
    this.status = err.status || 500;
    this.level = err.level || 0;

    logger.log({
      message: this.message,
      status: this.status,
      level: this.level
    });
  }
}

module.exports = ErrorHelper;
