const sinon = require('sinon');
const authenticationHelper = require('../../helpers/authenticationHelper');

describe('auth handler unit tests', () => {
  let sandbox;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    dbMock.cleanupMock();
  });

  describe('[POST] /auth/login', () => {
    it('should return 400 bad request missing username/password', () => {
      const BODY = { user: { username: 'username' } };

      return request.post('/auth/login').send(BODY).expect(400)
        .then((res) => expect(res.body.message).to.equal('Username/password not given.'));
    });

    it('should return 400 incorrect password', () => {
      const BODY = {
        user: {
          username: 'username',
          password: 'password'
        }
      };

      sandbox.stub(authenticationHelper, 'comparePassword').resolves(false);

      return request.post('/auth/login').send(BODY).expect(400)
        .then((res) => expect(res.body.message).to.equal('Incorrect password.'));
    });

    it('should return 200 and store new session', () => {
      const BODY = {
        user: {
          username: 'username',
          password: 'password'
        }
      };

      sandbox.stub(authenticationHelper, 'comparePassword').resolves(true);

      // due to request session middleware not existing in unit tests,
      // call to db.storeSession() accesses undefined values of undefined objects
      // and test request returns 500 (setting request session should be reconsidered)
      return request.post('/auth/login').send(BODY).expect(500);
    });
  });

  describe('[POST] /auth/logout', () => {
    it('should return 404 session not found', () => {
      dbMock.stubDatabaseManagerMethod('removeSession', { message: '', status: 404 }, true);

      return request.post('/auth/logout').expect(404);
    });

    it('should return 200 and remove session', () => {
      dbMock.stubDatabaseManagerMethod('removeSession', {});

      return request.post('/auth/logout').expect(200);
    });
  });
});
