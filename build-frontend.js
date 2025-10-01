const { execSync } = require('child_process');
const path = require('path');

console.log('🏗️  Building FlowVeda Frontend...\n');

try {
  // Change to frontend directory
  process.chdir(path.join(__dirname, 'frontend'));
  
  console.log('📦 Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n🔨 Building React app...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\n✅ Frontend build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}

