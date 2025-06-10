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

// ? Health Check BEFORE mounting route middleware
app.get('/api', (req, res) => {
  res.send('? Contact Uploader API is running');
});

app.get('/user', (req, res) => {
  res.send('? User Route is running');
});

// Routes
app.use('/api', postRoutes);
app.use('/user', userRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('? MongoDB connected');
    startCronJob();
  })
  .catch(err => {
    console.error('? MongoDB connection error:', err);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});