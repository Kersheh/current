const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Video', new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  metadata: {}, // TODO: Update characteristics when ffmpegHelper _transformMetadata is built
  thumbnail: {
    contentType: String,
    data: Buffer,
    size: String
  }
}));
