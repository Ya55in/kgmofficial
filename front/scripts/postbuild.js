const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');
const scriptsDir = path.join(__dirname);

// Files to copy: [source, destination]
const filesToCopy = [
  [path.join(scriptsDir, '.htaccess'), path.join(outDir, '.htaccess')],
  [path.join(scriptsDir, 'models', '.htaccess'), path.join(outDir, 'models', '.htaccess')],
  [path.join(scriptsDir, 'models', 'index.html'), path.join(outDir, 'models', 'index.html')],
];

console.log('📦 Post-build: Copying .htaccess files and models/index.html...');

filesToCopy.forEach(([source, dest]) => {
  try {
    // Create destination directory if it doesn't exist
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      console.log(`✅ Created directory: ${destDir}`);
    }

    // Copy file
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, dest);
      console.log(`✅ Copied: ${path.basename(source)} → ${path.relative(outDir, dest)}`);
    } else {
      console.warn(`⚠️  Source file not found: ${source}`);
    }
  } catch (error) {
    console.error(`❌ Error copying ${source} to ${dest}:`, error.message);
    process.exit(1);
  }
});

console.log('✅ Post-build complete!');








