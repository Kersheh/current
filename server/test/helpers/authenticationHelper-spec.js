const bcrypt = require('bcryptjs');
const db = require('../../helpers/databaseManager');
const authenticationHelper = require('../../helpers/authenticationHelper');

describe('authenticationHelper unit tests', () => {
  afterEach(() => {
    dbMock.cleanupMock();
  });

  it('should compare password with non-existent user and throw error', () => {
    const username = 'username';
    const password = 'password';

    dbMock.stubDatabaseManagerMethod('getUserPassword', {});

    return expect(authenticationHelper.comparePassword(password, username))
      .to.be.rejected;
  });

  it('should compare correct password and return true', () => {
    const password = 'password';
    const user = {
      username: 'username',
      password: bcrypt.hashSync(password, 1)
    };

    dbMock.stubDatabaseManagerMethod('getUserPassword', user);

    return expect(authenticationHelper.comparePassword(password, user.username))
      .to.eventually.equal(true);
  });

  it('should compare incorrect password and return false', () => {
    const password = 'password';
    const user = {
      username: 'username',
      password: bcrypt.hashSync('differentPassword', 1)
    };

    dbMock.stubDatabaseManagerMethod('getUserPassword', user);

    return expect(authenticationHelper.comparePassword(password, user.username))
      .to.eventually.equal(false);
  });

  it('should successfully authenticate request', () => {
    const session = {
      username: 'username',
      sessionID: 'sessionID',
      cookie: {
        _expires: new Date('9999-12-12')
      }
    };
    const req = {
      sessionID: 'sessionID',
      session
    };

    dbMock.stubDatabaseManagerMethod('getSession', session);
    dbMock.stubDatabaseManagerMethod('updateSession', {});
    dbMock.stubDatabaseManagerMethod('getSessionsByUsername', [session]);

    authenticationHelper.authenticate(req, {}, (err) => {
      expect(err).to.be.undefined;
    });
  });

  it('should fail to authenticate request with non-existent session', () => {
    const session = null;
    const req = {
      sessionID: 'sessionID',
      session
    };

    dbMock.stubDatabaseManagerMethod('getSession', session);
    dbMock.stubDatabaseManagerMethod('updateSession', {});
    dbMock.stubDatabaseManagerMethod('getSessionsByUsername', [session]);

    authenticationHelper.authenticate(req, {}, (err) => {
      expect(err).to.not.be.undefined;
      expect(err.message).to.equal('Access denied. Session not authenticated.');
    });
  });

  it('should fail to authenticate request with expired session and delete stored session', () => {
    const session = {
      username: 'username',
      sessionID: 'sessionID',
      cookie: {
        _expires: new Date('1970-01-01')
      }
    };
    const req = {
      sessionID: 'sessionID',
      session
    };

    dbMock.stubDatabaseManagerMethod('getSession', session);
    dbMock.stubDatabaseManagerMethod('updateSession', {});
    dbMock.stubDatabaseManagerMethod('getSessionsByUsername', [session]);
    dbMock.stubDatabaseManagerMethod('removeSession', {});

    authenticationHelper.authenticate(req, {}, (err) => {
      expect(err).to.not.be.undefined;
      expect(err.message).to.equal('Access denied. Session has expired.');
      expect(db.removeSession.calledOnce).to.equal(true);
    });
  });

  // TODO: Test authenticateSocket middleware
});
