const axios = require('axios');
require('dotenv').config();

async function generateCaption(prompt) {
  const res = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'deepseek/deepseek-r1:free',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPEN_ROUTER_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return res.data.choices?.[0]?.message?.content;
}

module.exports = { generateCaption };
