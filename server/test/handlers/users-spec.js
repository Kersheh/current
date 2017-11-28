describe('users handler unit tests', () => {
  describe('[GET] /users/', () => {
    afterEach(() => {
      dbMock.cleanupMock();
    });

    it('should return 200 with list of users', () => {
      const USERS = [
        { username: 'username1', admin: true },
        { username: 'username2', admin: false }
      ];

      authMock.authValid();
      dbMock.stubDatabaseManagerMethod('getUsers', USERS);

      return request.get('/users').expect(200, USERS);
    });

    it('should return 204 with empty list', () => {
      authMock.authValid();
      dbMock.stubDatabaseManagerMethod('getUsers', []);

      return request.get('/users').expect(204, []);
    });

    it('should return 401 access denied', () => {
      authMock.authInvalid();

      return request.get('/users').expect(401);
    });
  });
});
