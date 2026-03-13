#!/usr/bin/env tsx

/**
 * Combined Media Migration and Replacement Script
 * 
 * This script:
 * 1. Uploads all media files from /public to Supabase Storage
 * 2. Replaces all local media references in source code with Supabase URLs
 * 3. Optionally deletes local files after replacement
 * 
 * Usage:
 *   npm run migrate:all
 *   npm run migrate:all -- --keep-local  (keep local files after replacement)
 *   npm run migrate:all -- --dry-run     (preview changes without applying)
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { glob } from 'glob';

// Load environment variables
dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || 'media';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SRC_SECTIONS_DIR = path.join(__dirname, '..', 'src', 'sections');
const SRC_DIR = path.join(__dirname, '..', 'src');
const ROOT_DIR = path.join(__dirname, '..');
const MAX_CONCURRENT_UPLOADS = 5;

// Flags
const KEEP_LOCAL = process.argv.includes('--keep-local');
const DRY_RUN = process.argv.includes('--dry-run') || process.argv.includes('-d');

// Supported media file extensions
const MEDIA_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
  '.mp4', '.webm', '.mov', '.avi',
  '.mp3', '.wav', '.ogg', '.m4a',
  '.pdf', // PDF files
];

// File extensions to search in source files
const SOURCE_EXTENSIONS = ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js'];
const EXCLUDE_PATTERNS = ['node_modules', '.next', 'dist', 'build', '*.backup'];

// Initialize Supabase client
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing Supabase configuration!');
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Get all media files recursively from a directory
 */
function getAllMediaFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllMediaFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (MEDIA_EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Convert absolute file path to relative path for Supabase storage
 * Handles both public/ and src/sections/ directories
 */
function getRelativePath(filePath: string): string {
  let relativePath: string;
  
  if (filePath.startsWith(PUBLIC_DIR)) {
    relativePath = path.relative(PUBLIC_DIR, filePath);
  } else if (filePath.startsWith(SRC_SECTIONS_DIR)) {
    // For src/sections files, prefix with "sections/" in storage
    relativePath = 'sections/' + path.relative(SRC_SECTIONS_DIR, filePath);
  } else {
    relativePath = path.relative(ROOT_DIR, filePath);
  }
  
  return relativePath.replace(/\\/g, '/');
}

/**
 * Get local path reference (as used in code) from file path
 */
function getLocalPath(filePath: string): string {
  if (filePath.startsWith(PUBLIC_DIR)) {
    const relativePath = path.relative(PUBLIC_DIR, filePath);
    return '/' + relativePath.replace(/\\/g, '/');
  } else if (filePath.startsWith(SRC_SECTIONS_DIR)) {
    // For src/sections files, they might be referenced differently
    // Check if they're referenced with /sections/ prefix
    const relativePath = path.relative(SRC_SECTIONS_DIR, filePath);
    return '/sections/' + relativePath.replace(/\\/g, '/');
  }
  return '';
}

/**
 * Upload a single file to Supabase Storage
 * Returns true if successful, false otherwise
 */
async function uploadFile(filePath: string, stats: any): Promise<boolean> {
  const relativePath = getRelativePath(filePath);
  const fileContent = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  try {
    // Check if file already exists
    const { data: existingFiles } = await supabase.storage
      .from(BUCKET_NAME)
      .list(path.dirname(relativePath).replace(/\\/g, '/'), {
        limit: 1000,
        search: fileName,
      });

    if (existingFiles && existingFiles.some(f => f.name === fileName)) {
      console.log(`⏭️  Skipped (already exists): ${relativePath}`);
      stats.skipped++;
      return true; // Consider existing files as successful
    }

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(relativePath, fileContent, {
        contentType: getContentType(filePath),
        upsert: false,
        cacheControl: '3600',
      });

    if (error) {
      throw error;
    }

    stats.uploaded++;
    console.log(`✅ Uploaded: ${relativePath}`);
    return true;
  } catch (error: any) {
    stats.failed++;
    const errorMessage = error?.message || String(error);
    stats.errors.push({ file: relativePath, error: errorMessage });
    console.error(`❌ Failed to upload ${relativePath}: ${errorMessage}`);
    return false;
  }
}

/**
 * Get content type based on file extension
 */
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo', '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
    '.ogg': 'audio/ogg', '.m4a': 'audio/mp4',
    '.pdf': 'application/pdf',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Ensure bucket exists
 */
async function ensureBucketExists(): Promise<void> {
  const { error: testError } = await supabase.storage.from(BUCKET_NAME).list('', { limit: 1 });
  
  if (!testError) {
    console.log(`✅ Bucket "${BUCKET_NAME}" exists and is accessible`);
    return;
  }

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    console.log(`⚠️  Could not list buckets: ${listError.message}`);
    console.log(`📦 Attempting to create bucket: ${BUCKET_NAME}`);
  } else {
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (bucketExists) {
      console.log(`✅ Bucket "${BUCKET_NAME}" exists`);
      return;
    }
  }

  console.log(`📦 Attempting to create bucket: ${BUCKET_NAME}`);
  
  try {
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 52428800,
      allowedMimeTypes: null,
    });

    if (createError) {
      const errorMessage = createError.message || '';
      const errorName = createError.name || '';
      if (errorMessage.includes('row-level security') || 
          errorMessage.includes('RLS') ||
          errorMessage.includes('violates') ||
          errorMessage.includes('PGRST301') ||
          errorMessage.includes('42501') ||
          errorName.includes('PGRST301') ||
          errorName.includes('42501')) {
        console.log(`\n⚠️  Cannot create bucket programmatically (RLS policy restriction).`);
        console.log(`   Assuming bucket "${BUCKET_NAME}" exists (created manually).`);
        console.log(`   Proceeding with uploads...\n`);
        return;
      }
      throw createError;
    }
    console.log(`✅ Bucket created successfully`);
  } catch (error: any) {
    const errorMessage = error?.message || '';
    const errorName = error?.name || '';
    if (!errorMessage.includes('row-level security') && 
        !errorMessage.includes('RLS') &&
        !errorMessage.includes('violates') &&
        !errorMessage.includes('PGRST301') &&
        !errorMessage.includes('42501') &&
        !errorName.includes('PGRST301') &&
        !errorName.includes('42501')) {
      throw new Error(`Failed to create bucket: ${error.message}`);
    }
    console.log(`\n⚠️  Bucket creation failed due to RLS policies.`);
    console.log(`   Assuming bucket "${BUCKET_NAME}" exists (created manually).`);
    console.log(`   Proceeding with uploads...\n`);
  }
}

/**
 * Process uploads with concurrency control
 * Returns a Set of successfully uploaded file paths
 */
async function processUploads(files: string[], stats: any): Promise<Set<string>> {
  const uploadQueue: Promise<{ filePath: string; success: boolean }>[] = [];
  let currentIndex = 0;
  const successfulUploads = new Set<string>();

  while (currentIndex < files.length || uploadQueue.length > 0) {
    while (uploadQueue.length < MAX_CONCURRENT_UPLOADS && currentIndex < files.length) {
      const filePath = files[currentIndex++];
      const uploadPromise = uploadFile(filePath, stats).then((success) => {
        if (success) {
          successfulUploads.add(filePath);
        }
        const index = uploadQueue.indexOf(uploadPromise);
        if (index > -1) {
          uploadQueue.splice(index, 1);
        }
        return { filePath, success };
      });
      uploadQueue.push(uploadPromise);
    }

    if (uploadQueue.length > 0) {
      await Promise.race(uploadQueue);
    }
  }

  return successfulUploads;
}

/**
 * Generate public URL for uploaded file
 */
function getPublicUrl(filePath: string): string {
  const relativePath = getRelativePath(filePath);
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(relativePath);
  return data.publicUrl;
}

/**
 * Normalize path for comparison
 */
function normalizePath(p: string): string {
  let normalized = p.startsWith('/') ? p.slice(1) : p;
  normalized = decodeURIComponent(normalized);
  normalized = normalized.replace(/\\/g, '/');
  return normalized.toLowerCase();
}

/**
 * Find all media references in a file
 */
function findMediaReferences(content: string): string[] {
  const references: string[] = [];
  
  const patterns = [
    /src=["']([^"']+)["']/g,
    /src=\{["']([^"']+)["']\}/g,
    /src=\{`([^`]+)`\}/g,
    /<source\s+src=["']([^"']+)["']/g,
    /backgroundImage:\s*url\(["']([^"']+)["']\)/g,
    /background-image:\s*url\(["']([^"']+)["']\)/g,
    /image:\s*["']([^"']+)["']/g,
    /image:\s*["']([^"']+)["']/g,
    /video:\s*["']([^"']+)["']/g,
    /icon:\s*["']([^"']+)["']/g,
    /productSheet:\s*["']([^"']+)["']/g,
    /tyreLabel:\s*["']([^"']+)["']/g,
    /href=["']([^"']+)["']/g,
    /from\s+["']([^"']+)["']/g, // import statements
    /import\s+.*\s+from\s+["']([^"']+)["']/g, // import statements
    /["'](\/[^"']+\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov|avi|mp3|wav|ogg|m4a|pdf))["']/g,
    /["'](@\/sections\/[^"']+\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov|avi|mp3|wav|ogg|m4a|pdf))["']/g, // @/sections/ imports
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const path = match[1];
      // Handle both /path and @/sections/path patterns
      if ((path.startsWith('/') && !path.startsWith('//') && !path.startsWith('http')) ||
          (path.startsWith('@/sections/') && !path.startsWith('http'))) {
        references.push(path);
      }
    }
  });

  return Array.from(new Set(references));
}

/**
 * Replace media references in a file
 */
function replaceMediaInFile(filePath: string, mapping: Record<string, string>, stats: any): boolean {
  const content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content;
  let modified = false;
  const references = findMediaReferences(content);

  references.forEach(localPath => {
    // Handle @/sections/ imports by converting to /sections/ for mapping lookup
    let lookupPath = localPath;
    if (localPath.startsWith('@/sections/')) {
      lookupPath = '/' + localPath.replace('@/', '');
    }
    
    if (mapping[localPath] || mapping[lookupPath]) {
      const supabaseUrl = mapping[localPath] || mapping[lookupPath];
      
      const replacements = [
        [`src="${localPath}"`, `src="${supabaseUrl}"`],
        [`src='${localPath}'`, `src='${supabaseUrl}'`],
        [`src={"${localPath}"}`, `src={"${supabaseUrl}"}`],
        [`src={'${localPath}'}`, `src={'${supabaseUrl}'}`],
        [`src={\`${localPath}\`}`, `src={\`${supabaseUrl}\`}`],
        [`<source src="${localPath}"`, `<source src="${supabaseUrl}"`],
        [`<source src='${localPath}'`, `<source src='${supabaseUrl}'`],
        [`image: "${localPath}"`, `image: "${supabaseUrl}"`],
        [`image: '${localPath}'`, `image: '${supabaseUrl}'`],
        [`video: "${localPath}"`, `video: "${supabaseUrl}"`],
        [`video: '${localPath}'`, `video: '${supabaseUrl}'`],
        [`icon: "${localPath}"`, `icon: "${supabaseUrl}"`],
        [`icon: '${localPath}'`, `icon: '${supabaseUrl}'`],
        [`productSheet: "${localPath}"`, `productSheet: "${supabaseUrl}"`],
        [`productSheet: '${localPath}'`, `productSheet: '${supabaseUrl}'`],
        [`tyreLabel: "${localPath}"`, `tyreLabel: "${supabaseUrl}"`],
        [`tyreLabel: '${localPath}'`, `tyreLabel: '${supabaseUrl}'`],
        [`href="${localPath}"`, `href="${supabaseUrl}"`],
        [`href='${localPath}'`, `href='${supabaseUrl}'`],
        [`from "${localPath}"`, `from "${supabaseUrl}"`], // import statements
        [`from '${localPath}'`, `from '${supabaseUrl}'`], // import statements
        [`"${localPath}"`, `"${supabaseUrl}"`],
        [`'${localPath}'`, `'${supabaseUrl}'`],
        [`\`${localPath}\``, `\`${supabaseUrl}\``],
      ];

      replacements.forEach(([old, replacement]) => {
        if (newContent.includes(old)) {
          newContent = newContent.replace(new RegExp(escapeRegExp(old), 'g'), replacement);
          modified = true;
          stats.totalReplacements++;
        }
      });
    } else {
      // Try normalized path matching
      let normalizedLocal = normalizePath(localPath);
      // Also try converting @/sections/ to /sections/
      if (localPath.startsWith('@/sections/')) {
        normalizedLocal = normalizePath('/' + localPath.replace('@/', ''));
      }
      
      const matchingKey = Object.keys(mapping).find(key => 
        normalizePath(key) === normalizedLocal || 
        (key.startsWith('/sections/') && normalizedLocal.includes('sections/'))
      );
      
      if (matchingKey) {
        const supabaseUrl = mapping[matchingKey];
        const replacements = [
          [`src="${localPath}"`, `src="${supabaseUrl}"`],
          [`src='${localPath}'`, `src='${supabaseUrl}'`],
          [`src={"${localPath}"}`, `src={"${supabaseUrl}"}`],
          [`src={'${localPath}'}`, `src={'${supabaseUrl}'}`],
          [`image: "${localPath}"`, `image: "${supabaseUrl}"`],
          [`image: '${localPath}'`, `image: '${supabaseUrl}'`],
          [`video: "${localPath}"`, `video: "${supabaseUrl}"`],
          [`video: '${localPath}'`, `video: '${supabaseUrl}'`],
          [`icon: "${localPath}"`, `icon: "${supabaseUrl}"`],
          [`icon: '${localPath}'`, `icon: '${supabaseUrl}'`],
          [`productSheet: "${localPath}"`, `productSheet: "${supabaseUrl}"`],
          [`productSheet: '${localPath}'`, `productSheet: '${supabaseUrl}'`],
          [`tyreLabel: "${localPath}"`, `tyreLabel: "${supabaseUrl}"`],
          [`tyreLabel: '${localPath}'`, `tyreLabel: '${supabaseUrl}'`],
          [`href="${localPath}"`, `href="${supabaseUrl}"`],
          [`href='${localPath}'`, `href='${supabaseUrl}'`],
          [`from "${localPath}"`, `from "${supabaseUrl}"`], // import statements
          [`from '${localPath}'`, `from '${supabaseUrl}'`], // import statements
          [`"${localPath}"`, `"${supabaseUrl}"`],
          [`'${localPath}'`, `'${supabaseUrl}'`],
          [`\`${localPath}\``, `\`${supabaseUrl}\``],
        ];

        replacements.forEach(([old, replacement]) => {
          if (newContent.includes(old)) {
            newContent = newContent.replace(new RegExp(escapeRegExp(old), 'g'), replacement);
            modified = true;
            stats.totalReplacements++;
          }
        });
      } else {
        if (!stats.skipped.includes(localPath)) {
          stats.skipped.push(localPath);
        }
      }
    }
  });

  if (modified) {
    if (!DRY_RUN) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
    }
    stats.filesModified++;
    return true;
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
 * Get all source files to process
 */
async function getSourceFiles(): Promise<string[]> {
  const files: string[] = [];
  
  for (const ext of SOURCE_EXTENSIONS) {
    const pattern = path.join(SRC_DIR, ext).replace(/\\/g, '/');
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
 * Main migration function
 */
async function main() {
  if (DRY_RUN) {
    console.log('🔍 DRY-RUN MODE: No files will be uploaded, modified, or deleted\n');
  }

  console.log('🚀 Starting combined media migration and replacement...\n');

  // Step 1: Upload files
  console.log('='.repeat(60));
  console.log('STEP 1: Uploading media files to Supabase');
  console.log('='.repeat(60));
  
  if (!fs.existsSync(PUBLIC_DIR) && !fs.existsSync(SRC_SECTIONS_DIR)) {
    console.error(`❌ Error: No media directories found!`);
    console.error(`   Expected either ${PUBLIC_DIR} or ${SRC_SECTIONS_DIR}`);
    process.exit(1);
  }

  try {
    await ensureBucketExists();
  } catch (error: any) {
    console.error(`\n❌ Error setting up bucket: ${error.message}`);
    process.exit(1);
  }

  // Scan both public and src/sections directories
  console.log(`\n📂 Scanning for media files...`);
  const publicFiles = fs.existsSync(PUBLIC_DIR) ? getAllMediaFiles(PUBLIC_DIR) : [];
  const sectionsFiles = fs.existsSync(SRC_SECTIONS_DIR) ? getAllMediaFiles(SRC_SECTIONS_DIR) : [];
  const files = [...publicFiles, ...sectionsFiles];
  
  console.log(`📊 Found ${files.length} media files to upload`);
  console.log(`   - ${publicFiles.length} from public/`);
  console.log(`   - ${sectionsFiles.length} from src/sections/\n`);

  if (files.length === 0) {
    console.log('ℹ️  No media files found to upload.');
    return;
  }

  const uploadStats = {
    total: files.length,
    uploaded: 0,
    failed: 0,
    skipped: 0,
    errors: [] as Array<{ file: string; error: string }>,
  };

  const startTime = Date.now();
  console.log(`⏳ Starting uploads (max ${MAX_CONCURRENT_UPLOADS} concurrent)...\n`);

  const successfulUploads = await processUploads(files, uploadStats);

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log('\n' + '='.repeat(60));
  console.log('📊 Upload Summary');
  console.log('='.repeat(60));
  console.log(`Total files: ${uploadStats.total}`);
  console.log(`✅ Uploaded: ${uploadStats.uploaded}`);
  console.log(`⏭️  Skipped: ${uploadStats.skipped}`);
  console.log(`❌ Failed: ${uploadStats.failed}`);
  console.log(`⏱️  Duration: ${duration}s`);
  console.log('='.repeat(60));

  // Generate URL mapping - only for successfully uploaded files
  const urlMapping: Record<string, string> = {};
  const localPathMapping: Record<string, string> = {}; // Map filePath to localPath
  
  successfulUploads.forEach((filePath) => {
    const relativePath = getRelativePath(filePath);
    const localPath = getLocalPath(filePath);
    const supabaseUrl = getPublicUrl(filePath);
    
    // Map both the standard local path and the file path
    if (localPath) {
      urlMapping[localPath] = supabaseUrl;
    }
    
    // Also map the relative path from src/sections if it's different
    if (filePath.startsWith(SRC_SECTIONS_DIR)) {
      const sectionsRelative = path.relative(SRC_SECTIONS_DIR, filePath).replace(/\\/g, '/');
      // Try different possible path formats
      urlMapping[`/sections/${sectionsRelative}`] = supabaseUrl;
      urlMapping[`sections/${sectionsRelative}`] = supabaseUrl;
      urlMapping[`src/sections/${sectionsRelative}`] = supabaseUrl;
      urlMapping[`/src/sections/${sectionsRelative}`] = supabaseUrl;
      urlMapping[`@/sections/${sectionsRelative}`] = supabaseUrl; // Handle @/sections/ imports
    }
    
    localPathMapping[filePath] = localPath || relativePath;
  });

  const mappingFile = path.join(ROOT_DIR, 'supabase-url-mapping.json');
  if (!DRY_RUN) {
    fs.writeFileSync(mappingFile, JSON.stringify(urlMapping, null, 2));
    console.log(`\n📝 URL mapping saved to: ${mappingFile}`);
  }

  // Step 2: Replace references in code
  console.log('\n' + '='.repeat(60));
  console.log('STEP 2: Replacing references in source code');
  console.log('='.repeat(60));

  const sourceFiles = await getSourceFiles();
  console.log(`\n📂 Found ${sourceFiles.length} source files to process\n`);

  const replaceStats = {
    totalReplacements: 0,
    filesModified: 0,
    skipped: [] as string[],
    errors: [] as Array<{ file: string; error: string }>,
  };

  for (let index = 0; index < sourceFiles.length; index++) {
    const filePath = sourceFiles[index];
    const relativePath = path.relative(ROOT_DIR, filePath);
    
    try {
      const wasModified = replaceMediaInFile(filePath, urlMapping, replaceStats);
      
      if (wasModified) {
        console.log(`[${index + 1}/${sourceFiles.length}] ✅ Updated: ${relativePath}`);
      }
    } catch (error: any) {
      replaceStats.errors.push({
        file: relativePath,
        error: error.message,
      });
      console.error(`[${index + 1}/${sourceFiles.length}] ❌ Error: ${relativePath}: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Replacement Summary');
  console.log('='.repeat(60));
  console.log(`Total replacements: ${replaceStats.totalReplacements}`);
  console.log(`Files modified: ${replaceStats.filesModified}`);
  console.log(`Skipped (not in mapping): ${replaceStats.skipped.length}`);
  console.log(`Errors: ${replaceStats.errors.length}`);
  console.log('='.repeat(60));

  if (replaceStats.errors.length > 0) {
    console.log('\n❌ Errors:');
    replaceStats.errors.slice(0, 10).forEach(({ file, error }) => {
      console.log(`  - ${file}: ${error}`);
    });
  }

  if (replaceStats.skipped.length > 0) {
    console.log(`\n⚠️  Skipped ${replaceStats.skipped.length} files not found in mapping:`);
    replaceStats.skipped.slice(0, 10).forEach(path => {
      console.log(`  - ${path}`);
    });
  }

  // Step 3: Delete successfully uploaded files
  if (!KEEP_LOCAL && !DRY_RUN && successfulUploads.size > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('STEP 3: Deleting successfully uploaded local files');
    console.log('='.repeat(60));
    
    let deletedCount = 0;
    let deleteErrors: Array<{ file: string; error: string }> = [];
    
    successfulUploads.forEach((filePath) => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          deletedCount++;
          const relativePath = path.relative(ROOT_DIR, filePath);
          console.log(`🗑️  Deleted: ${relativePath}`);
        }
      } catch (error: any) {
        deleteErrors.push({
          file: path.relative(ROOT_DIR, filePath),
          error: error.message,
        });
        console.error(`❌ Failed to delete ${path.relative(ROOT_DIR, filePath)}: ${error.message}`);
      }
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Deletion Summary');
    console.log('='.repeat(60));
    console.log(`Files deleted: ${deletedCount}`);
    console.log(`Delete errors: ${deleteErrors.length}`);
    console.log('='.repeat(60));
    
    if (deleteErrors.length > 0) {
      console.log('\n❌ Deletion errors:');
      deleteErrors.forEach(({ file, error }) => {
        console.log(`  - ${file}: ${error}`);
      });
    }
  } else if (KEEP_LOCAL) {
    console.log('\n📦 Local files kept (--keep-local flag set)');
  }

  // Report failed uploads
  if (uploadStats.failed > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('⚠️  FAILED UPLOADS - Files NOT deleted');
    console.log('='.repeat(60));
    console.log(`The following ${uploadStats.failed} files failed to upload and were kept:`);
    uploadStats.errors.forEach(({ file, error }) => {
      console.log(`  ❌ ${file}: ${error}`);
    });
    console.log('='.repeat(60));
  }

  console.log('\n✅ Migration complete!');
  if (DRY_RUN) {
    console.log('\n🔍 DRY-RUN complete! No files were actually modified or deleted.');
    console.log('   Run without --dry-run to apply changes.');
  }
}

// Run migration
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

