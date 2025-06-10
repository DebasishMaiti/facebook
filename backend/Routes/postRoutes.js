const express = require('express');
const router = express.Router();
const { scheduleAIPost } = require('../Controller/postController');

router.post('/schedule-ai-post', scheduleAIPost);

module.exports = router;
