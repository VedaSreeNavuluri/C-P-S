const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('Building frontend...');
  // Run npm install and build in repo root
  const repoRoot = path.join(__dirname, '..');
  execSync('npm install', { stdio: 'inherit', cwd: repoRoot });
  execSync('npm run build', { stdio: 'inherit', cwd: repoRoot });

  console.log('Starting server...');
  // Start the existing server.js in this folder
  require('./server');
} catch (err) {
  console.error('renderStart failed:', err && err.message ? err.message : err);
  process.exit(1);
}
