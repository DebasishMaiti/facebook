const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  facebookId: String,
  facebookPageId: String,
  facebookPageAccessToken: String,
});

module.exports = mongoose.model('User', userSchema);
