const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');
const ErrorHelper = require('~/helpers/errorHelper');
const db = require('~/helpers/tempDatabase');

// function getVideo(id) {
//   return new Promise((resolve) => {
//     let video = _.find(db.videos, (video) => { return video.id === id; });
//
//     if(_.isUndefined(video)) {
//       throw new ErrorHelper({
//         message: `Request for video id '${id}' not found`,
//         status: 404
//       });
//     }
//     resolve(video);
//   });
// }
//
// function createVideo(id, video) {
//   if(!_.find(db.videos, (video) => { return video.id === id; })) {
//     db.videos.push(video);
//   }
// }
//
// function updateVideo(id, prop) {
//   const video = _.find(db.videos, (video) => { return video.id === id; });
//   if(video) {
//     _.extend(video, prop);
//   }
// }
//
// function removeVideo(id) {
//   _.remove(db.videos, (video) => { return video.id === id; });
// }
//
// function getVideos(videos) {
//   return db.videos;
// }
//
// module.exports = {
//   getVideo,
//   createVideo,
//   updateVideo,
//   removeVideo,
//   getVideos
// };

const DB_URL = 'mongodb://localhost:27017/current';

class DatabaseClient {
  constructor(url) {
    this.mongoPromise = this.connect(url);
  }

  connect(url) {
    return MongoClient.connect(url)
      .catch(() => {
        throw new ErrorHelper({
          message: `Failed to connect database to ${url}.`,
          status: 500,
          level: 1
        });
      });
  }

  createVideo(id, video) {
    if(!_.find(db.videos, (video) => { return video.id === id; })) {
      db.videos.push(video);
    }
  }

  getVideo(id) {
    return new Promise((resolve) => {
      let video = _.find(db.videos, (video) => { return video.id === id; });

      if(_.isUndefined(video)) {
        throw new ErrorHelper({
          message: `Request for video id '${id}' not found`,
          status: 404
        });
      }
      resolve(video);
    });
  }

  updateVideo(id, prop) {
    const video = _.find(db.videos, (video) => { return video.id === id; });
    if(video) {
      _.extend(video, prop);
    }
  }

  removeVideo(id) {
    _.remove(db.videos, (video) => { return video.id === id; });
  }

  getVideos(videos) {
    return db.videos;
  }
}

module.exports = new DatabaseClient(DB_URL);
