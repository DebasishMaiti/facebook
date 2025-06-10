const Post = require('../Model/Post');
const { generateCaption } = require('../utills/deepseek');
const { generateImage } = require('../utills/deepai');

exports.scheduleAIPost = async (req, res) => {
  try {
    const { prompt, scheduledTime, userId } = req.body;

    if (!prompt || !scheduledTime || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
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
    res.status(201).json({ message: 'Post scheduled successfully', post: newPost });
  } catch (err) {
    console.error('Error scheduling post:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
