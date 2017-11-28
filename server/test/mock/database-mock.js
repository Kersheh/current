const sinon = require('sinon');
const db = require('../../helpers/databaseManager');

const sandbox = sinon.createSandbox();

function stubDatabaseManagerMethod(method, data, rejects = false) {
  if(rejects) {
    sandbox.stub(db, method).rejects(data);
  } else {
    sandbox.stub(db, method).resolves(data);
  }
}

function cleanupMock() {
  sandbox.restore();
}

module.exports = {
  stubDatabaseManagerMethod,
  cleanupMock
};
