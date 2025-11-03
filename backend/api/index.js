// Vercel serverless function - Main API handler
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      // Remove deprecated options and use modern connection settings
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/community-solver', {
        ssl: true,
        tlsAllowInvalidCertificates: false, // Set to false for production
      });
      console.log('✓ MongoDB connected successfully');
    }
  } catch (err) {
    console.error('✗ MongoDB connection error:', err);
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