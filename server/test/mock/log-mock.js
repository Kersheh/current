const sinon = require('sinon');
const logHelper = require('../../helpers/logHelper');

// stubs logger from writing test errors to file and console
sinon.stub(logHelper, 'log').resolves();
