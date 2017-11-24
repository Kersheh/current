const config = require('config');
const nock = require('nock');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const syncLibrary = require('../../helpers/syncLibrary');
const db = require('../../helpers/databaseManager');
const logHelper = require('../../helpers/logHelper');

const sandbox = sinon.createSandbox();
sandbox.stub(config, 'get').withArgs('SERVER.PORT').returns(5000);
sandbox.stub(db, 'connect').resolves();
sandbox.stub(db, 'disconnect').resolves();
sandbox.stub(syncLibrary, 'syncVideoLibrary').resolves();
sandbox.stub(logHelper, 'log').resolves(); // stubs logger from writing test errors to file/console

before(() => {
  require('../../app');
  global.chai = require('chai');
  global.expect = global.chai.expect;
  global.chai.use(chaiAsPromised);
});

afterEach(() => {
  nock.cleanAll();
});
