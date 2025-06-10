const axios = require('axios');

async function generateImage(prompt) {
  const res = await axios.post(
    'https://api.openai.com/v1/images/generations',
    {
      prompt: `${prompt}`,
      n: 1,
      size: '512x512',
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    }
  );
  return res.data.data[0].url;
}

module.exports = { generateImage };
