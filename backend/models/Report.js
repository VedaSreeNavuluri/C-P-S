const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['garbage', 'lighting', 'road', 'water', 'Resolved'],
  },
  description: {
    type: String,
    required: true,
  },
  file: {
    type: String, // Store file path
    default: null,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

// Add a method to get file URL
reportSchema.methods.getFileUrl = function() {
  if (!this.file) return null;
  
  // Check if we're in a Vercel environment
  const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
  
  if (isVercel) {
    // In Vercel, files in /tmp are not accessible via HTTP
    // For production, integrate with cloud storage (AWS S3, Cloudinary, etc.)
    return null;
  } else {
    // For local development, files are accessible via /uploads route
    return `/uploads/${this.file}`;
  }
};

module.exports = mongoose.model('Report', reportSchema);