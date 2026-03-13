#!/usr/bin/env tsx

/**
 * Script to find and delete unused media files
 * 
 * This script:
 * 1. Scans all media files in /public directory
 * 2. Searches for references in source code
 * 3. Identifies files that are not referenced
 * 4. Deletes unused files (or shows them in dry-run mode)
 * 
 * Usage:
 *   npm run delete:unused -- --dry-run  (preview only)
 *   npm run delete:unused               (delete unused files)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DRY_RUN = process.argv.includes('--dry-run') || process.argv.includes('-d');

// Supported media file extensions
const MEDIA_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
  '.mp4', '.webm', '.mov', '.avi',
  '.mp3', '.wav', '.ogg', '.m4a',
  '.pdf',
];

// File extensions to search in source files
const SOURCE_EXTENSIONS = ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js', '**/*.css', '**/*.html'];
const EXCLUDE_PATTERNS = ['node_modules', '.next', 'dist', 'build', '*.backup'];

/**
 * Get all media files recursively from a directory
 */
function getAllMediaFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    
    try {
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        getAllMediaFiles(filePath, fileList);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (MEDIA_EXTENSIONS.includes(ext)) {
          fileList.push(filePath);
        }
      }
    } catch (error) {
      // Skip files that can't be accessed
      console.warn(`Warning: Could not access ${filePath}`);
    }
  });

  return fileList;
}

/**
 * Convert absolute file path to relative path from public directory
 */
function getRelativePath(filePath: string): string {
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  return relativePath.replace(/\\/g, '/');
}

/**
 * Get all paths that could reference a media file
 */
function getPossiblePaths(mediaPath: string): string[] {
  const relativePath = getRelativePath(mediaPath);
  const paths: string[] = [];

  // Different possible paths
  paths.push(`/${relativePath}`);
  paths.push(`/assets/${relativePath.replace(/^assets\//, '')}`);
  paths.push(relativePath);
  paths.push(relativePath.replace(/^assets\//, ''));
  
  // Also check with URL encoding
  paths.push(encodeURI(`/${relativePath}`));
  paths.push(encodeURI(`/assets/${relativePath.replace(/^assets\//, '')}`));

  return paths;
}

/**
 * Get all source files to search
 */
async function getSourceFiles(): Promise<string[]> {
  const files: string[] = [];
  
  for (const ext of SOURCE_EXTENSIONS) {
    const pattern = path.join(ROOT_DIR, ext).replace(/\\/g, '/');
    try {
      const found = await glob(pattern, {
        ignore: EXCLUDE_PATTERNS.map(p => `**/${p}/**`),
        absolute: true,
      });
      files.push(...found);
    } catch (error) {
      console.warn(`Warning: Could not glob pattern ${pattern}:`, error);
    }
  }

  return Array.from(new Set(files));
}

/**
 * Check if a media file is referenced in source code
 */
async function isFileReferenced(mediaPath: string, sourceFiles: string[]): Promise<boolean> {
  const fileName = path.basename(mediaPath);
  const relativePath = getRelativePath(mediaPath);
  const possiblePaths = getPossiblePaths(mediaPath);

  // Search in all source files
  for (const sourceFile of sourceFiles) {
    try {
      const content = fs.readFileSync(sourceFile, 'utf-8');
      
      // Check for exact filename
      if (content.includes(fileName)) {
        // Verify it's a real reference (not just a comment or similar)
        for (const pathToCheck of possiblePaths) {
          if (content.includes(pathToCheck)) {
            return true;
          }
          
          // Also check for URL-encoded paths
          const encodedPath = encodeURIComponent(pathToCheck);
          if (content.includes(encodedPath)) {
            return true;
          }
        }
      }
      
      // Check for patterns like src="/path", image: "/path", etc.
      for (const pathToCheck of possiblePaths) {
        const patterns = [
          new RegExp(`["'\`]${escapeRegExp(pathToCheck)}["'\`]`, 'g'),
          new RegExp(`src=["'\`]${escapeRegExp(pathToCheck)}["'\`]`, 'g'),
          new RegExp(`image:\\s*["'\`]${escapeRegExp(pathToCheck)}["'\`]`, 'g'),
          new RegExp(`video:\\s*["'\`]${escapeRegExp(pathToCheck)}["'\`]`, 'g'),
          new RegExp(`icon:\\s*["'\`]${escapeRegExp(pathToCheck)}["'\`]`, 'g'),
          new RegExp(`href=["'\`]${escapeRegExp(pathToCheck)}["'\`]`, 'g'),
        ];
        
        for (const pattern of patterns) {
          if (pattern.test(content)) {
            return true;
          }
        }
      }
    } catch (error) {
      // Skip files that can't be read
      // Continue to next file
    }
  }

  return false;
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Main function
 */
async function main() {
  if (DRY_RUN) {
    console.log('🔍 DRY-RUN MODE: No files will be deleted\n');
  }

  console.log('🚀 Scanning for unused media files...\n');

  // Get all media files
  console.log(`📂 Scanning media files in ${PUBLIC_DIR}...`);
  const mediaFiles = getAllMediaFiles(PUBLIC_DIR);
  console.log(`📊 Found ${mediaFiles.length} media files\n`);

  if (mediaFiles.length === 0) {
    console.log('ℹ️  No media files found.');
    return;
  }

  // Get all source files
  console.log(`📂 Scanning source files...`);
  const sourceFiles = await getSourceFiles();
  console.log(`📊 Found ${sourceFiles.length} source files to search\n`);

  // Check each media file
  console.log('🔍 Checking which files are used...\n');
  const unusedFiles: string[] = [];
  const usedFiles: string[] = [];
  const errors: Array<{ file: string; error: string }> = [];

  for (let i = 0; i < mediaFiles.length; i++) {
    const mediaFile = mediaFiles[i];
    const relativePath = path.relative(ROOT_DIR, mediaFile);
    
    process.stdout.write(`[${i + 1}/${mediaFiles.length}] Checking: ${relativePath}... `);
    
    try {
      const isReferenced = await isFileReferenced(mediaFile, sourceFiles);
      
      if (isReferenced) {
        usedFiles.push(mediaFile);
        process.stdout.write('✅ Used\n');
      } else {
        unusedFiles.push(mediaFile);
        process.stdout.write('❌ Unused\n');
      }
    } catch (error: any) {
      errors.push({ file: relativePath, error: error.message });
      process.stdout.write(`⚠️  Error: ${error.message}\n`);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary');
  console.log('='.repeat(60));
  console.log(`Total media files: ${mediaFiles.length}`);
  console.log(`✅ Used: ${usedFiles.length}`);
  console.log(`❌ Unused: ${unusedFiles.length}`);
  console.log(`⚠️  Errors: ${errors.length}`);
  console.log('='.repeat(60));

  if (errors.length > 0) {
    console.log('\n⚠️  Errors:');
    errors.forEach(({ file, error }) => {
      console.log(`  - ${file}: ${error}`);
    });
  }

  if (unusedFiles.length > 0) {
    console.log(`\n🗑️  Unused files (${unusedFiles.length}):`);
    unusedFiles.forEach(file => {
      const relativePath = path.relative(ROOT_DIR, file);
      console.log(`  - ${relativePath}`);
    });

    if (DRY_RUN) {
      console.log('\n🔍 DRY-RUN: No files were deleted.');
      console.log('   Run without --dry-run to delete these files.');
    } else {
      console.log('\n🗑️  Deleting unused files...');
      
      let deleted = 0;
      let failed = 0;
      
      for (const file of unusedFiles) {
        try {
          fs.unlinkSync(file);
          deleted++;
          const relativePath = path.relative(ROOT_DIR, file);
          console.log(`  ✅ Deleted: ${relativePath}`);
        } catch (error: any) {
          failed++;
          const relativePath = path.relative(ROOT_DIR, file);
          console.error(`  ❌ Failed to delete ${relativePath}: ${error.message}`);
        }
      }

      console.log('\n' + '='.repeat(60));
      console.log('📊 Deletion Summary');
      console.log('='.repeat(60));
      console.log(`✅ Deleted: ${deleted}`);
      console.log(`❌ Failed: ${failed}`);
      console.log('='.repeat(60));
    }
  } else {
    console.log('\n✅ All media files are being used!');
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

