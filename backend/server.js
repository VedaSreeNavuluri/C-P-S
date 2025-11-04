const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// ==============================
// Global error handlers
// ==============================
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});

// ==============================
// CORS Configuration
// ==============================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://c-p-s-g6vo.vercel.app',
  'https://c-p-s-hj7c.vercel.app',
  process.env.FRONTEND_URL, // from Render environment variable
].filter(Boolean); // remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      console.log('✅ CORS allowed: No origin (like mobile app or curl)');
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS allowed: ${origin}`);
      return callback(null, true);
    }

    console.warn(`❌ CORS blocked: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// ==============================
// Middleware
// ==============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==============================
// Database Connection
// ==============================
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/community-solver';
  try {
    await mongoose.connect(uri);
    console.log('✓ MongoDB connected successfully');
  } catch (err) {
    console.error('✗ MongoDB connection error:', err.message);
    console.log('Server continues running, but database ops will fail until MongoDB is available.');
  }
};

connectDB();

// ==============================
// Routes
// ==============================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/report', require('./routes/report'));
app.use('/api/contact', require('./routes/contact'));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', time: new Date().toISOString() });
});

// Debug Route (Optional for testing CORS)
app.get('/api/debug/origin', (req, res) => {
  res.json({
    receivedOrigin: req.get('origin'),
    allowedOrigins,
  });
});

// ==============================
// Serve Frontend (optional if full-stack deploy)
// ==============================
const serveFrontend = () => {
  try {
    const buildPath = path.join(__dirname, '..', 'build');
    if (fs.existsSync(buildPath)) {
      app.use(express.static(buildPath));

      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        res.sendFile(path.join(buildPath, 'index.html'));
      });
      console.log('✓ Frontend build is being served from', buildPath);
    }
  } catch (e) {
    console.warn('Could not enable frontend static serving:', e.message);
  }
};

serveFrontend();

// ==============================
// Exports / Start Server
// ==============================
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('Allowed origins:', allowedOrigins);
  });
}
