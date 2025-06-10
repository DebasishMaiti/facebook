require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const postRoutes = require('./Routes/postRoutes');
const userRoutes = require('./Routes/userRoutes');
const startCronJob = require('./cron/postScheduler');

const app = express();
const PORT = process.env.PORT || 1000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', postRoutes);
app.use('/user', userRoutes);

// ✅ Default route to show backend status on browser
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// Optional: Health check for API route
app.get('/api', (req, res) => {
  res.send('✅ Contact Uploader API is running');
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  startCronJob();
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});