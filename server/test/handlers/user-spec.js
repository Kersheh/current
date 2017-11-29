const sinon = require('sinon');
const authenticationHelper = require('../../helpers/authenticationHelper');

describe('user handler unit tests', () => {
  let sandbox;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    dbMock.cleanupMock();
  });

  describe('[GET] /user/:username', () => {
    const USER_ID = 'username';

    it('should return 200 with user', () => {
      const USER = {
        username: USER_ID,
        admin: false
      };

      authMock.authValid();
      dbMock.stubDatabaseManagerMethod('getUser', USER);

      return request.get(`/user/${USER_ID}`).expect(200)
        .then((res) => expect(res.body).to.deep.equal(USER));
    });

    it('should return 404 user not found', () => {
      const RES_MESSAGE = `User ${USER_ID} not found.`;

      authMock.authValid();
      dbMock.stubDatabaseManagerMethod('getUser', null);

      return request.get(`/user/${USER_ID}`).expect(404)
        .then((res) => expect(res.body.message).to.equal(RES_MESSAGE));
    });

    it('should return 401 access denied', () => {
      authMock.authInvalid();

      return request.get(`/user/${USER_ID}`).expect(401);
    });
  });

  describe('[POST] /user/', () => {
    it('should return 400 bad request missing username/password', () => {
      const BODY = { user: { username: 'username' } };

      return request.post('/user').send(BODY).expect(400);
    });

    it('should return 200 user created', () => {
      const BODY = {
        user: {
          username: 'username',
          password: 'password'
        }
      };

      sandbox.stub(authenticationHelper, 'hashPassword').resolves();
      dbMock.stubDatabaseManagerMethod('createUser', {});

      return request.post('/user').send(BODY).expect(200);
    });

    it('should return 409 user already exists', () => {
      const BODY = {
        user: {
          username: 'username',
          password: 'password'
        }
      };

      sandbox.stub(authenticationHelper, 'hashPassword').resolves();
      dbMock.stubDatabaseManagerMethod('createUser', { status: 409 }, true);

      return request.post('/user').send(BODY).expect(409);
    });

    it('should return 500 system error', () => {
      const BODY = {
        user: {
          username: 'username',
          password: 'password'
        }
      };

      sandbox.stub(authenticationHelper, 'hashPassword').resolves();
      dbMock.stubDatabaseManagerMethod('createUser', { status: 500 }, true);

      return request.post('/user').send(BODY).expect(500);
    });
  });
});
