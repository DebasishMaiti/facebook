const cron = require('node-cron');
const Post = require('../Model/Post');
const User = require('../Model/User');
const axios = require('axios');

async function postToFacebook({ pageAccessToken, pageId, message, imageUrl }) {
  try {
    const postUrl = imageUrl
      ? `https://graph.facebook.com/${pageId}/feed` // 👈 Use feed instead of photos
      : `https://graph.facebook.com/${pageId}/feed`;

    const payload = imageUrl
      ? { message: `${message}\n\n${imageUrl}`, access_token: pageAccessToken }
      : { message, access_token: pageAccessToken };

    const res = await axios.post(postUrl, payload);
    return res.data;
  } catch (err) {
    console.error('Facebook API error:', err.response?.data || err.message);
    return null;
  }
}


function startCronJob() {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    console.log(`Cron job running at ${now.toISOString()} (IST)`);
    const posts = await Post.find({ scheduledTime: { $lte: now }, posted: false });
    console.log(`Found ${posts.length} posts to process:`, posts.map(p => p._id.toString()));

    for (let post of posts) {
      console.log(`Processing post ${post._id} for user ${post.userId}`);
      const user = await User.findById(post.userId);
         if (!user || !user.facebookPageAccessToken) {
          console.log(`Skipping post ${post._id}: No user or token`);

        // 🔒 Force update in DB
        await Post.updateOne(
        { _id: post._id },
       { $set: { posted: true } }
      );

  // 🔍 Confirm update
  const check = await Post.findById(post._id);
  console.log(`✅ Forced update: posted = ${check.posted}`);

  continue;
}
      const session = await Post.startSession();         
    try {
     await session.withTransaction(async () => {
    const fbRes = await postToFacebook({
      pageAccessToken: user.facebookPageAccessToken,
      pageId: user.facebookPageId,
      message: post.content,
      imageUrl: post.imageUrl,
    });

    if (fbRes?.id) {
      post.posted = true;
      await post.save({ session }); // ✅ Must save inside session
      console.log(`✅ Posted to Facebook: ${fbRes.id}`);
    } else {
      console.warn(`⚠️ Failed to post ${post._id}`);
    }
  });
} catch (err) {
  console.error(`🚫 Transaction failed:`, err.message);
} finally {
  await session.endSession();
}
    }
  });
}

module.exports = startCronJob;