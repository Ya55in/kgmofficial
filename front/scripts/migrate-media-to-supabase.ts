#!/usr/bin/env tsx

/**
 * Media Migration Script to Supabase Storage
 * 
 * This script migrates all media files (images, videos, audio) from the /public directory
 * to Supabase Storage while maintaining the folder structure.
 * 
 * Usage:
 *   npm run migrate:media
 * 
 * Requirements:
 *   - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file
 *   - Supabase Storage bucket created (default: 'media')
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

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
const MAX_CONCURRENT_UPLOADS = 5; // Limit concurrent uploads to avoid rate limits

// Supported media file extensions
const MEDIA_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', // Images
  '.mp4', '.webm', '.mov', '.avi', // Videos
  '.mp3', '.wav', '.ogg', '.m4a', // Audio
];

interface FileStats {
  total: number;
  uploaded: number;
  failed: number;
  skipped: number;
  errors: Array<{ file: string; error: string }>;
}

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
 * Convert absolute file path to relative path from public directory
 */
function getRelativePath(filePath: string): string {
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  // Normalize path separators to use forward slashes (for web URLs)
  return relativePath.replace(/\\/g, '/');
}

/**
 * Upload a single file to Supabase Storage
 */
async function uploadFile(filePath: string, stats: FileStats): Promise<void> {
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
      return;
    }

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(relativePath, fileContent, {
        contentType: getContentType(filePath),
        upsert: false, // Set to true if you want to overwrite existing files
        cacheControl: '3600', // Cache for 1 hour
      });

    if (error) {
      throw error;
    }

    stats.uploaded++;
    console.log(`✅ Uploaded: ${relativePath}`);
  } catch (error: any) {
    stats.failed++;
    const errorMessage = error?.message || String(error);
    stats.errors.push({ file: relativePath, error: errorMessage });
    console.error(`❌ Failed to upload ${relativePath}: ${errorMessage}`);
  }
}

/**
 * Get content type based on file extension
 */
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.m4a': 'audio/mp4',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Create storage bucket if it doesn't exist
 */
async function ensureBucketExists(): Promise<void> {
  // First, try to verify if bucket exists by attempting to list it
  // This is more reliable than listing all buckets
  const { error: testError } = await supabase.storage.from(BUCKET_NAME).list('', { limit: 1 });
  
  if (!testError) {
    // Bucket exists and is accessible
    console.log(`✅ Bucket "${BUCKET_NAME}" exists and is accessible`);
    return;
  }

  // If we get a "not found" error, try to list buckets to see if it exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    // If we can't list buckets, try to create it anyway
    console.log(`⚠️  Could not list buckets: ${listError.message}`);
    console.log(`📦 Attempting to create bucket: ${BUCKET_NAME}`);
  } else {
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (bucketExists) {
      // Bucket exists in list but test failed - might be a permissions issue
      console.log(`✅ Bucket "${BUCKET_NAME}" exists`);
      console.log(`⚠️  Warning: Could not verify accessibility. Make sure the bucket is set to "Public" in Supabase Dashboard.`);
      return;
    }
  }

  // Bucket doesn't exist, try to create it
  console.log(`📦 Attempting to create bucket: ${BUCKET_NAME}`);
  
  try {
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true, // Make bucket public for easy access
      fileSizeLimit: 52428800, // 50MB limit per file
      allowedMimeTypes: null, // Allow all types
    });

    if (createError) {
      // Check if it's an RLS policy error
      // Note: StorageError doesn't have a 'code' property, only 'message' and 'name'
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
        
        // Try to verify one more time after a short delay
        const { error: verifyError } = await supabase.storage.from(BUCKET_NAME).list('', { limit: 1 });
        if (verifyError && !verifyError.message.includes('not found')) {
          console.error(`\n❌ Error: Bucket may not be accessible: ${verifyError.message}`);
          console.error('   Please verify:');
          console.error('   1. Bucket name is correct: ' + BUCKET_NAME);
          console.error('   2. Bucket is set to "Public" in Supabase Dashboard');
          console.error('   3. Service role key has correct permissions\n');
          throw new Error('Bucket not accessible');
        }
        return;
      }
      throw createError;
    }
    console.log(`✅ Bucket created successfully`);
  } catch (error: any) {
    // If it's not an RLS error, re-throw it
    // Note: StorageError doesn't have a 'code' property, only 'message' and 'name'
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
    
    // For RLS errors, assume bucket exists and proceed
    console.log(`\n⚠️  Bucket creation failed due to RLS policies.`);
    console.log(`   Assuming bucket "${BUCKET_NAME}" exists (created manually).`);
    console.log(`   Proceeding with uploads...\n`);
  }
}

/**
 * Process uploads with concurrency control
 */
async function processUploads(files: string[], stats: FileStats): Promise<void> {
  const uploadQueue: Promise<void>[] = [];
  let currentIndex = 0;

  while (currentIndex < files.length || uploadQueue.length > 0) {
    // Fill queue up to max concurrent uploads
    while (uploadQueue.length < MAX_CONCURRENT_UPLOADS && currentIndex < files.length) {
      const filePath = files[currentIndex++];
      const uploadPromise = uploadFile(filePath, stats).then(() => {
        // Remove from queue when done
        const index = uploadQueue.indexOf(uploadPromise);
        if (index > -1) {
          uploadQueue.splice(index, 1);
        }
      });
      uploadQueue.push(uploadPromise);
    }

    // Wait for at least one upload to complete
    if (uploadQueue.length > 0) {
      await Promise.race(uploadQueue);
    }
  }
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
 * Main migration function
 */
async function main() {
  console.log('🚀 Starting media migration to Supabase Storage...\n');

  // Validate public directory exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`❌ Error: Public directory not found at ${PUBLIC_DIR}`);
    process.exit(1);
  }

  // Ensure bucket exists
  try {
    await ensureBucketExists();
  } catch (error: any) {
    console.error(`\n❌ Error setting up bucket: ${error.message}`);
    if (error.message.includes('manual setup')) {
      console.error('\n💡 Tip: After creating the bucket manually, run this script again.');
    }
    process.exit(1);
  }

  // Get all media files
  console.log(`\n📂 Scanning for media files in ${PUBLIC_DIR}...`);
  const files = getAllMediaFiles(PUBLIC_DIR);
  console.log(`📊 Found ${files.length} media files to upload\n`);

  if (files.length === 0) {
    console.log('ℹ️  No media files found to upload.');
    return;
  }

  // Initialize stats
  const stats: FileStats = {
    total: files.length,
    uploaded: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  // Start upload process
  const startTime = Date.now();
  console.log(`⏳ Starting uploads (max ${MAX_CONCURRENT_UPLOADS} concurrent)...\n`);

  await processUploads(files, stats);

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary');
  console.log('='.repeat(60));
  console.log(`Total files: ${stats.total}`);
  console.log(`✅ Uploaded: ${stats.uploaded}`);
  console.log(`⏭️  Skipped: ${stats.skipped}`);
  console.log(`❌ Failed: ${stats.failed}`);
  console.log(`⏱️  Duration: ${duration}s`);
  console.log('='.repeat(60));

  if (stats.errors.length > 0) {
    console.log('\n❌ Errors:');
    stats.errors.slice(0, 10).forEach(({ file, error }) => {
      console.log(`  - ${file}: ${error}`);
    });
    if (stats.errors.length > 10) {
      console.log(`  ... and ${stats.errors.length - 10} more errors`);
    }
  }

  // Generate URL mapping file (optional)
  if (stats.uploaded > 0) {
    const urlMapping: Record<string, string> = {};
    files.forEach((filePath) => {
      const relativePath = getRelativePath(filePath);
      urlMapping[`/${relativePath}`] = getPublicUrl(filePath);
    });

    const mappingFile = path.join(__dirname, '..', 'supabase-url-mapping.json');
    fs.writeFileSync(mappingFile, JSON.stringify(urlMapping, null, 2));
    console.log(`\n📝 URL mapping saved to: ${mappingFile}`);
    console.log('   You can use this file to update references in your codebase.');
  }

  if (stats.failed > 0) {
    process.exit(1);
  }
}

// Run migration
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

