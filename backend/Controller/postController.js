const Post = require('../Model/Post');
const { generateCaption } = require('../utills/deepseek');
const { generateImage } = require('../utills/deepai');

exports.scheduleAIPost = async (req, res) => {
  try {
    let requestId = 'UNKNOWN';
    const { prompt, scheduledTime, userId, requestId:reqIdFromBody } = req.body;
    requestId = reqIdFromBody || 'MISSING';
    if (!prompt || !scheduledTime || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`Received request [${requestId}]:`, { userId, scheduledTime, prompt });

    // Check for duplicate post
    const existingPost = await Post.findOne({ 
      userId, 
      scheduledTime, 
      content: { $regex: prompt, $options: 'i' }, 
      posted: false 
    });
    if (existingPost) {
      console.log(`Duplicate post found for request [${requestId}]:`, existingPost._id);
      return res.status(400).json({ error: 'A similar post is already scheduled for this time' });
    }

    const caption = await generateCaption(prompt);
    const imageUrl = await generateImage(prompt);
    const newPost = new Post({
      userId,
      content: caption,
      imageUrl,
      scheduledTime,
      posted: false
    });

    await newPost.save();
    console.log(`Post created for request [${requestId}]:`, newPost._id);
    res.status(201).json({ message: 'Post scheduled successfully', post: newPost });
  } catch (err) {
    console.error(`Error scheduling post [${requestId}]:`, err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};