const sinon = require('sinon');
const db = require('../../helpers/databaseManager');

const sandbox = sinon.createSandbox();

function stubDatabaseManagerMethod(method, data) {
  sandbox.stub(db, method).resolves(data);
}

function cleanupMock() {
  sandbox.restore();
}

module.exports = {
  stubDatabaseManagerMethod,
  cleanupMock
};
