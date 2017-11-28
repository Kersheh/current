const authenticationHelper = require('../../helpers/authenticationHelper');
const dbMock = require('../mock/database-mock');

describe('videos handler unit tests', () => {
  describe('[GET] /', () => {
    afterEach(() => {
      dbMock.cleanupMock();
    });

    it('should return 200 with list of videos', () => {
      const VIDEOS = [
        { id: 'b178448e', name: 'video1', type: 'mp4' },
        { id: '28711534', name: 'video2', type: 'mkv' },
        { id: '5f7625a2', name: 'video3', type: 'avi' }
      ];

      authMock.authValid();
      dbMock.stubDatabaseManagerMethod('getVideos', VIDEOS);

      return request.get('/videos').expect(200, VIDEOS);
    });

    it('should return 206 with empty list', () => {
      authMock.authValid();
      dbMock.stubDatabaseManagerMethod('getVideos', []);

      return request.get('/videos').expect(204, []);
    });

    it('should return 401 access denied', () => {
      authMock.authInvalid();

      return request.get('/videos').expect(401);
    });
  });
});
