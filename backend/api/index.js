// Vercel serverless function - Main API handler
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/community-solver', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✓ MongoDB connected successfully');
    }
  } catch (err) {
    console.error('✗ MongoDB connection error:', err.message);
  }
};

// Connect to DB
connectDB();

// Routes - Note: Vercel routes /api/* to this file, so paths should match frontend
app.use('/api/auth', require('../routes/auth'));
app.use('/api/report', require('../routes/report'));
app.use('/api/contact', require('../routes/contact'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Community Solver API is running' });
});

// Export as serverless function for Vercel
module.exports = app;
