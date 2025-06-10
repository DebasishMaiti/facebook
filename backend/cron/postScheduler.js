const cron = require('node-cron');
const Post = require('../Model/Post');
const User = require('../Model/User');
const axios = require('axios');

async function postToFacebook({ pageAccessToken, pageId, message, imageUrl }) {
  try {
    if (imageUrl) {
      const res = await axios.post(`https://graph.facebook.com/${pageId}/photos`, {
        url: imageUrl,
        caption: message,
        access_token: pageAccessToken,
      });
      return res.data;
    } else {
      const res = await axios.post(`https://graph.facebook.com/${pageId}/feed`, {
        message,
        access_token: pageAccessToken,
      });
      return res.data;
    }
  } catch (err) {
    console.error('Facebook API error:', err.response?.data || err.message);
    return null;
  }
}

function startCronJob() {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const posts = await Post.find({ scheduledTime: { $lte: now }, posted: false });

    for (let post of posts) {
      const user = await User.findById(post.userId);
      if (!user || !user.facebookPageAccessToken) continue;

      const fbRes = await postToFacebook({
        pageAccessToken: user.facebookPageAccessToken,
        pageId: user.facebookPageId,
        message: post.content,
        imageUrl: post.imageUrl,
      });

      if (fbRes?.id) {
        post.posted = true;
        await post.save();
      }
    }
  });
}

module.exports = startCronJob;
