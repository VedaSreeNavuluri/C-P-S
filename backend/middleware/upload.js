const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// For Vercel, use /tmp directory (only writable location in serverless)
// For local development, use uploads directory
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
const uploadsDir = isVercel 
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, '../uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Add a helper function to get file URL
upload.getFileUrl = (filename) => {
  // For Vercel deployments, files in /tmp are not accessible via HTTP
  // In production, you should integrate with a cloud storage service like AWS S3 or Cloudinary
  if (isVercel) {
    return null; // Files uploaded to /tmp are not publicly accessible
  } else {
    // For local development, files are accessible via /uploads route
    return `/uploads/${filename}`;
  }
};

module.exports = upload;