// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const router = express.Router();

// // Generate JWT token
// const generateToken = (userId) => {
//   return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key-change-in-production', {
//     expiresIn: '7d',
//   });
// };

// // Signup route
// router.post('/signup', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Validate input
//     if (!name || !email || !password) {
//       return res.status(400).json({ error: 'Please provide all required fields' });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User with this email already exists' });
//     }

//     // Create new user
//     const user = new User({ name, email, password });
//     await user.save();

//     // Generate token
//     const token = generateToken(user._id);

//     res.status(201).json({
//       message: 'User created successfully',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error('Signup error:', error);
    
//     // Handle MongoDB duplicate key error
//     if (error.code === 11000) {
//       return res.status(400).json({ error: 'User with this email already exists' });
//     }
    
//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ error: Object.values(error.errors).map(e => e.message).join(', ') });
//     }
    
//     // Handle connection errors
//     if (error.name === 'MongoServerError' || error.message.includes('Mongo')) {
//       return res.status(503).json({ error: 'Database connection error. Please try again later.' });
//     }
    
//     res.status(500).json({ error: error.message || 'Server error during signup' });
//   }
// });

// // Login route
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Please provide email and password' });
//     }

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Check password
//     const isPasswordValid = await user.comparePassword(password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Generate token
//     const token = generateToken(user._id);

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ error: 'Server error during login' });
//   }
// });

// module.exports = router;

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ================================
// JWT Helper
// ================================
const generateToken = (userId) => {
  try {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );
  } catch (err) {
    console.error('JWT generation error:', err.message);
    return null;
  }
};

// ================================
// Signup Route
// ================================
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'All fields (name, email, password) are required.',
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists.',
      });
    }

    // Create and save new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);
    if (!token) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate authentication token. Please try again.',
      });
    }

    // Success response
    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);

    // Duplicate email
    if (error.code === 11000) {
      return res.status(409).json({ success: false, error: 'Email already exists.' });
    }

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }

    // MongoDB connection issues
    if (error.name === 'MongoServerError' || error.message.includes('Mongo')) {
      return res.status(503).json({
        success: false,
        error: 'Database connection issue. Please try again later.',
      });
    }

    // Fallback
    res.status(500).json({
      success: false,
      error: 'Unexpected server error during signup. Please try again later.',
    });
  }
});

// ================================
// Login Route
// ================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input check
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Both email and password are required.',
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    // Generate token
    const token = generateToken(user._id);
    if (!token) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate authentication token. Please try again.',
      });
    }

    // Success
    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Unexpected server error during login. Please try again later.',
    });
  }
});

// ================================
// CORS & API Test Route
// ================================
router.options('*', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth route is reachable',
    time: new Date().toISOString(),
  });
});

module.exports = router;
