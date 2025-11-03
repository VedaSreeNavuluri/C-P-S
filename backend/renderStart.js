const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

try {
  console.log('Building frontend...');
  // Get paths for frontend and backend
  const repoRoot = path.join(__dirname, '..');
  const frontendPath = path.join(repoRoot, 'frontend');
  const backendPath = path.join(repoRoot, 'backend');
  
  // Check if frontend directory exists
  if (fs.existsSync(frontendPath)) {
    // Install frontend dependencies
    console.log('Installing frontend dependencies...');
    execSync('npm install', { stdio: 'inherit', cwd: frontendPath });
    
    // Build frontend
    console.log('Building frontend...');
    execSync('npm run build', { stdio: 'inherit', cwd: frontendPath });
    
    // Copy build to backend for serving
    const buildPath = path.join(frontendPath, 'build');
    const backendPublicPath = path.join(backendPath, 'build');
    
    if (fs.existsSync(buildPath)) {
      console.log('Copying frontend build to backend...');
      // Remove existing build folder in backend if it exists
      if (fs.existsSync(backendPublicPath)) {
        fs.rmSync(backendPublicPath, { recursive: true });
      }
      // Copy the build folder
      fs.cpSync(buildPath, backendPublicPath, { recursive: true });
    }
  } else {
    console.log('Frontend directory not found, skipping frontend build...');
  }

  console.log('Starting server...');
  // Start the existing server.js in this folder
  require('./server');
} catch (err) {
  console.error('renderStart failed:', err && err.message ? err.message : err);
  process.exit(1);
}