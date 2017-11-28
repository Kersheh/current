const config = require('config');
const nock = require('nock');
const sinon = require('sinon');
const mock = require('mock-require');
const syncLibrary = require('../../helpers/syncLibrary');
const db = require('../../helpers/databaseManager');
const logHelper = require('../../helpers/logHelper');
const auth = require('../../helpers/authenticationHelper');

const sandbox = sinon.createSandbox();
sandbox.stub(config, 'get').withArgs('SERVER.PORT').returns(3001);
sandbox.stub(db, 'connect').resolves();
sandbox.stub(db, 'disconnect').resolves();
sandbox.stub(syncLibrary, 'syncVideoLibrary').resolves();
sandbox.stub(logHelper, 'log').resolves(); // stubs logger from writing test errors to file/console

const authStub = sandbox.stub(auth, 'authenticate').callThrough();

mock('session-memory-store', Object);
mock('express-session', () => { return (req, res, next) => next(); });

before(() => {
  require('../../app');
  global.chai = require('chai');
  global.chai.use(require('chai-as-promised'));
  global.expect = chai.expect;
  global.request = require('supertest')('http://localhost:3001');

  global.authMock = {
    authValid: () => {
      authStub.callsFake((req, res, next) => {
        req.sessionID = 'sessionID';
        req.session = {
          username: 'username',
          sessionID: 'sessionID',
          cookie: {
            _expires: new Date('9999-12-12')
          }
        };
        next();
      });
    },
    authInvalid: () => {
      authStub.callsFake((req, res, next) => {
        res.status(401).json({
          message: 'Access denied. Session not authenticated.',
          status: 401
        });
      });
    }
  };
});

afterEach(() => {
  nock.cleanAll();
  authStub.reset();
  authStub.callThrough();
});
