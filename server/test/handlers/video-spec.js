const sinon = require('sinon');
const path = require('path');
const fs = require('fs');
const fileHelper = require('../../helpers/fileHelper');

describe('video handler unit tests', () => {
  describe('[GET] /:id', () => {
    let sandbox;
    const VIDEO_ID = 'some_random_id';

    before(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
      dbMock.cleanupMock();
    });

    it('should return 200 piping video stream', () => {
      const STREAM = fs.createReadStream(path.join(__dirname, '../videos/test.mp4'));

      authMock.authValid();
      sandbox.stub(fileHelper, 'streamVideo').resolves({ head: {}, stream: STREAM, status: 206 });

      return request.get(`/video/${VIDEO_ID}`).expect(206)
        .then((res) => expect(res).to.be.a.ReadableStream);
    });

    it('should return 404 video id not found', () => {
      const RES_MESSAGE = `Video id ${VIDEO_ID} not found.`;

      authMock.authValid();
      sandbox.stub(fileHelper, 'streamVideo').rejects();

      return request.get(`/video/${VIDEO_ID}`).expect(404)
        .then((res) => expect(res.body.message).to.equal(RES_MESSAGE));
    });

    it('should return 401 access denied', () => {
      authMock.authInvalid();

      return request.get(`/video/${VIDEO_ID}`).expect(401);
    });
  });
});
