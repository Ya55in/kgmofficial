#!/usr/bin/env tsx

/**
 * Retry failed uploads script
 * 
 * This script retries uploading files that previously failed
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || 'media';
const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SRC_SECTIONS_DIR = path.join(ROOT_DIR, 'src', 'sections');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing Supabase configuration!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

function getRelativePath(filePath: string): string {
  if (filePath.startsWith(PUBLIC_DIR)) {
    return path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
  } else if (filePath.startsWith(SRC_SECTIONS_DIR)) {
    return 'sections/' + path.relative(SRC_SECTIONS_DIR, filePath).replace(/\\/g, '/');
  }
  return path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
}

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

async function uploadFile(filePath: string): Promise<boolean> {
  const relativePath = getRelativePath(filePath);
  const fileSize = fs.statSync(filePath).size;
  const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
  
  console.log(`\n📤 Uploading: ${relativePath} (${fileSizeMB} MB)`);
  
  try {
    const fileContent = fs.readFileSync(filePath);
    
    // Try with upsert enabled in case it partially uploaded
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(relativePath, fileContent, {
        contentType: getContentType(filePath),
        upsert: true, // Allow overwriting
        cacheControl: '3600',
      });

    if (error) {
      console.error(`❌ Error: ${error.message}`);
      if (error.message.includes('size') || error.message.includes('limit')) {
        console.error(`   ⚠️  File size (${fileSizeMB} MB) may exceed bucket limit (50 MB)`);
      }
      return false;
    }

    console.log(`✅ Successfully uploaded: ${relativePath}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Failed: ${error.message || String(error)}`);
    if (error.message?.includes('fetch')) {
      console.error(`   ⚠️  Network error - file may be too large or connection timed out`);
    }
    return false;
  }
}

async function main() {
  const failedFiles = [
    path.join(PUBLIC_DIR, 'assets/Models/tivoli.pdf'),
    path.join(PUBLIC_DIR, 'assets/Models/rexton.pdf'),
    path.join(PUBLIC_DIR, 'assets/Models/torresevs.pdf'),
    path.join(SRC_SECTIONS_DIR, 'Brand/视频bg.mp4'),
    path.join(SRC_SECTIONS_DIR, 'Explore KGM Lineup/Explore KGM Lineup.mp4'),
  ];

  console.log('🔄 Retrying failed uploads...\n');
  
  const results = {
    success: [] as string[],
    failed: [] as string[],
  };

  for (const filePath of failedFiles) {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${path.relative(ROOT_DIR, filePath)}`);
      results.failed.push(filePath);
      continue;
    }

    const success = await uploadFile(filePath);
    if (success) {
      results.success.push(filePath);
    } else {
      results.failed.push(filePath);
    }
    
    // Small delay between uploads
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Retry Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successfully uploaded: ${results.success.length}`);
  console.log(`❌ Still failed: ${results.failed.length}`);
  console.log('='.repeat(60));

  if (results.failed.length > 0) {
    console.log('\n⚠️  Files that still failed to upload:');
    results.failed.forEach(filePath => {
      const relativePath = path.relative(ROOT_DIR, filePath);
      const fileSize = fs.statSync(filePath).size;
      const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
      console.log(`  ❌ ${relativePath} (${fileSizeMB} MB)`);
    });
    console.log('\n💡 Possible reasons:');
    console.log('   - File size exceeds Supabase bucket limit (50 MB default)');
    console.log('   - Network timeout for large files');
    console.log('   - Special characters in filename');
    console.log('   - Check Supabase dashboard for bucket size limits');
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

