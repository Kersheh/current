const path = require('path');
const sinon = require('sinon');
const fileHelper = require('../../helpers/fileHelper');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

describe('fileHelper unit tests', () => {
  let sandbox;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    dbMock.cleanupMock();
  });

  it('should successfully parse filename and hash name to video id', () => {
    const FILE = [
      'this_is-valid file[2017].mp4'
    ];
    const VIDEO = [
      { id: 'bc74f8e3', name: 'this_is-valid file[2017]', type: 'mp4' }
    ];

    sandbox.stub(fs, 'readdirAsync').resolves(FILE);

    return expect(fileHelper.readVideoFiles()).to.eventually.deep.equal(VIDEO);
  });

  it('should successfully return list of videos', () => {
    const FILES = [
      'video1.mp4',
      'video2.mkv',
      'video3.avi'
    ];
    const VIDEOS = [
      { id: 'b178448e', name: 'video1', type: 'mp4' },
      { id: '28711534', name: 'video2', type: 'mkv' },
      { id: '5f7625a2', name: 'video3', type: 'avi' }
    ];

    sandbox.stub(fs, 'readdirAsync').resolves(FILES);

    return expect(fileHelper.readVideoFiles()).to.eventually.deep.equal(VIDEOS);
  });

  it('should successfully return list of only valid video filenames', () => {
    const FILES = [
      'video1.mp4',
      '.mp4',
      'missingtype.',
      '.invalid.'
    ];
    const VIDEOS = [
      { id: 'b178448e', name: 'video1', type: 'mp4' }
    ];

    sandbox.stub(fs, 'readdirAsync').resolves(FILES);

    return expect(fileHelper.readVideoFiles()).to.eventually.deep.equal(VIDEOS);
  });

  it('should throw video path not found error', () => {
    sandbox.stub(fs, 'readdirAsync').rejects();

    return expect(fileHelper.readVideoFiles()).to.be.rejected;
  });

  it('should throw video id not found error', () => {
    const id = 'not found video id';

    dbMock.stubDatabaseManagerMethod('getVideo', undefined);

    return fileHelper.streamVideo(id)
      .catch((err) => {
        expect(err.message).to.equal(`Request for video id '${id}' not found`);
      });
  });

  it('should throw id found but file not found error', () => {
    const id = 'validFileId';
    const VIDEO = { id: 'b178448e', name: 'video1', type: 'mp4' };
    const VIDEO_PATH = path.join(__dirname, `../../videos/${VIDEO.name}.${VIDEO.type}`);

    sandbox.stub(fs, 'statAsync').withArgs(VIDEO_PATH).rejects();
    dbMock.stubDatabaseManagerMethod('getVideo', VIDEO);

    return fileHelper.streamVideo(id)
      .catch((err) => {
        expect(err.message).to.equal(`Video id '${id}' exists but file not found!`);
      });
  });

  it('should successfully return chunked video file stream', () => {
    const VIDEO_ID = 'videoId';
    const STREAM_RANGE = 'bytes=0-128';
    const FILE_STAT = {
      size: 256
    };
    const VIDEO = { id: 'b178448e', name: 'video1', type: 'mp4' };
    const RESPONSE = {
      head: {
        'Content-Range': 'bytes 0-128/256',
        'Accept-Ranges': 'bytes',
        'Content-Length': 129,
        'Content-Type': 'video/mp4'
      },
      stream: {},
      status: 206
    };

    dbMock.stubDatabaseManagerMethod('getVideo', VIDEO);
    sandbox.stub(fs, 'statAsync').resolves(FILE_STAT);
    sandbox.stub(fs, 'createReadStream').returns({});

    return expect(fileHelper.streamVideo(VIDEO_ID, STREAM_RANGE)).to.eventually
      .deep.equal(RESPONSE);
  });

  it('should successfully return full video file stream', () => {
    const VIDEO_ID = 'videoId';
    const FILE_STAT = {
      size: 256
    };
    const VIDEO = { id: 'b178448e', name: 'video1', type: 'mp4' };
    const RESPONSE = {
      head: {
        'Content-Length': 256,
        'Content-Type': 'video/mp4'
      },
      stream: {},
      status: 200
    };

    dbMock.stubDatabaseManagerMethod('getVideo', VIDEO);
    sandbox.stub(fs, 'statAsync').resolves(FILE_STAT);
    sandbox.stub(fs, 'createReadStream').returns({});

    return expect(fileHelper.streamVideo(VIDEO_ID)).to.eventually
      .deep.equal(RESPONSE);
  });
});
