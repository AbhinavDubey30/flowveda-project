const { execSync } = require('child_process');
const path = require('path');

console.log('📦 Installing all dependencies...\n');

try {
  // Install root dependencies
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  
  // Install frontend dependencies
  console.log('\nInstalling frontend dependencies...');
  execSync('npm install', { 
    stdio: 'inherit', 
    cwd: path.join(__dirname, 'frontend') 
  });
  
  // Install backend dependencies
  console.log('\nInstalling backend dependencies...');
  execSync('npm install', { 
    stdio: 'inherit', 
    cwd: path.join(__dirname, 'backend') 
  });
  
  // Install API dependencies
  console.log('\nInstalling API dependencies...');
  execSync('npm install', { 
    stdio: 'inherit', 
    cwd: path.join(__dirname, 'api') 
  });
  
  console.log('\n✅ All dependencies installed successfully!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Installation failed:', error.message);
  process.exit(1);
}

