const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Global error handlers to prevent the process from crashing on unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // don't exit process; the server can continue running and handle requests (DB ops will fail until DB is available)
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  // Log and continue (in production you might want to restart the process using a supervisor)
});

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', // Add this for your current setup
      process.env.FRONTEND_URL,
      // Add your Vercel domain here, or use environment variable
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // Restrict origins in production
      const isDevelopment = process.env.NODE_ENV === 'development';
      if (isDevelopment) {
        callback(null, true); // Allow all in development
      } else {
        callback(new Error('Not allowed by CORS')); // Restrict in production
      }
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/community-solver';
  try {
    // Newer drivers ignore useNewUrlParser/useUnifiedTopology; pass only the options that matter
    await mongoose.connect(uri);
    console.log('✓ MongoDB connected successfully');
  } catch (err) {
    console.error('✗ MongoDB connection error:', err && err.message ? err.message : err);
    console.log('Note: The server will continue running but database operations will fail until MongoDB is available.');
    console.log('Please make sure MongoDB is running or update MONGODB_URI in .env file');
    // Do not rethrow the error — keep the server process alive so nodemon doesn't mark it as crashed
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/report', require('./routes/report'));
app.use('/api/contact', require('./routes/contact'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve React frontend build (if present)
// This allows the backend to serve the frontend when you deploy the whole repo together
const serveFrontend = () => {
  try {
    const buildPath = path.join(__dirname, '..', 'build');
    // Only enable if build folder exists
    if (require('fs').existsSync(buildPath)) {
      app.use(express.static(buildPath));

      // For any non-API route, serve index.html — React Router will handle routing client-side
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        res.sendFile(path.join(buildPath, 'index.html'));
      });
      console.log('✓ Frontend build is being served from', buildPath);
    }
  } catch (e) {
    console.warn('Could not enable frontend static serving:', e && e.message ? e.message : e);
  }
};

// Call unconditionally — serve if build exists (useful for local testing)
serveFrontend();

// For Vercel serverless functions, export the app instead of listening
module.exports = app;

// Only listen if running locally (not on Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
