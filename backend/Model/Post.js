const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  imageUrl: String,
  scheduledTime: Date,
  posted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Post', postSchema);
