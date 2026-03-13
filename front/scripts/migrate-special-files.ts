#!/usr/bin/env tsx

/**
 * Script to migrate files with special characters in names to Supabase
 * Renames them with valid names and updates references in code
 * 
 * Usage:
 *   npm run migrate:special-files
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
const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SRC_DIR = path.join(ROOT_DIR, 'src');

// Files to migrate with special characters
const SPECIAL_FILES = [
  {
    originalPath: 'public/assets/brandstory/[KGM]Forest_30sec.mp4',
    newName: 'kgm-forest-30sec.mp4',
    supabasePath: 'assets/brandstory/kgm-forest-30sec.mp4'
  },
  {
    originalPath: 'public/assets/brandstory/视频bg.mp4',
    newName: 'video-bg.mp4',
    supabasePath: 'assets/brandstory/video-bg.mp4',
    supabaseUrl: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/brandstory/video-bg.mp4'
  },
  {
    originalPath: 'public/assets/brandstory/Enregistrement de l\'écran 2025-11-04 à 21.37.55.mp4',
    newName: 'screen-recording-2025-11-04.mp4',
    supabasePath: 'assets/brandstory/screen-recording-2025-11-04.mp4'
  }
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
 * Get content type based on file extension
 */
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes: Record<string, string> = {
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
  };
  return contentTypes[ext] || 'video/mp4';
}

/**
 * Upload file to Supabase
 */
async function uploadFile(filePath: string, supabasePath: string): Promise<string | null> {
  try {
    const fileContent = fs.readFileSync(filePath);
    
    // Check if file already exists
    const dirPath = path.dirname(supabasePath).replace(/\\/g, '/');
    const fileName = path.basename(supabasePath);
    const { data: existingFiles } = await supabase.storage
      .from(BUCKET_NAME)
      .list(dirPath, {
        limit: 1000,
        search: fileName,
      });

    if (existingFiles && existingFiles.some(f => f.name === fileName)) {
      console.log(`⏭️  File already exists: ${supabasePath}`);
      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(supabasePath);
      return data.publicUrl;
    }

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(supabasePath, fileContent, {
        contentType: getContentType(filePath),
        upsert: false,
        cacheControl: '3600',
      });

    if (error) {
      throw error;
    }

    console.log(`✅ Uploaded: ${supabasePath}`);
    
    // Get public URL
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(supabasePath);
    return urlData.publicUrl;
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    console.error(`❌ Failed to upload ${supabasePath}: ${errorMessage}`);
    return null;
  }
}

/**
 * Get all source files to search
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
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Replace references in source files
 */
async function replaceReferences(
  oldPaths: string[],
  newUrl: string,
  sourceFiles: string[]
): Promise<number> {
  let replacements = 0;

  for (const sourceFile of sourceFiles) {
    try {
      let content = fs.readFileSync(sourceFile, 'utf-8');
      let modified = false;

      for (const oldPath of oldPaths) {
        // URL encoded versions
        const encodedOldPath = encodeURI(oldPath);
        const encodedOldPathWithSlash = encodeURI(oldPath.startsWith('/') ? oldPath : `/${oldPath}`);
        
        // Patterns to replace
        const patterns = [
          [`src="${oldPath}"`, `src="${newUrl}"`],
          [`src='${oldPath}'`, `src='${newUrl}'`],
          [`src={"${oldPath}"}`, `src={"${newUrl}"}`],
          [`src={'${oldPath}'}`, `src={'${newUrl}'}`],
          [`src={\`${oldPath}\`}`, `src={\`${newUrl}\`}`],
          [`<source src="${oldPath}"`, `<source src="${newUrl}"`],
          [`<source src='${oldPath}'`, `<source src='${newUrl}'`],
          [`src="${encodedOldPath}"`, `src="${newUrl}"`],
          [`src='${encodedOldPath}'`, `src='${newUrl}'`],
          [`src={"${encodedOldPath}"}`, `src={"${newUrl}"}`],
          [`src={'${encodedOldPath}'}`, `src={'${newUrl}'}`],
          [`<source src="${encodedOldPath}"`, `<source src="${newUrl}"`],
          [`<source src='${encodedOldPath}'`, `<source src='${newUrl}'`],
          [`"${oldPath}"`, `"${newUrl}"`],
          [`'${oldPath}'`, `'${newUrl}'`],
          [`\`${oldPath}\``, `\`${newUrl}\``],
        ];

        for (const [old, replacement] of patterns) {
          if (content.includes(old)) {
            content = content.replace(new RegExp(escapeRegExp(old), 'g'), replacement);
            modified = true;
            replacements++;
          }
        }
      }

      if (modified) {
        fs.writeFileSync(sourceFile, content, 'utf-8');
        console.log(`  ✅ Updated: ${path.relative(ROOT_DIR, sourceFile)}`);
      }
    } catch (error) {
      // Skip files that can't be read
    }
  }

  return replacements;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting migration of files with special characters...\n');

  const sourceFiles = await getSourceFiles();
  let totalUploaded = 0;
  let totalFailed = 0;
  let totalReplacements = 0;

  for (const fileInfo of SPECIAL_FILES) {
    const fullPath = path.join(ROOT_DIR, fileInfo.originalPath);
    
    console.log(`\n📄 Processing: ${fileInfo.originalPath}`);
    
    // Use provided Supabase URL if available, otherwise upload
    let supabaseUrl: string | null;
    
    if (fileInfo.supabaseUrl) {
      // Use the provided Supabase URL directly
      supabaseUrl = fileInfo.supabaseUrl;
      console.log(`  ✅ Using provided Supabase URL: ${supabaseUrl}`);
      totalUploaded++;
    } else {
      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  File not found, skipping: ${fileInfo.originalPath}`);
        continue;
      }

      // Upload to Supabase
      console.log(`  📤 Uploading to Supabase...`);
      supabaseUrl = await uploadFile(fullPath, fileInfo.supabasePath);

      if (!supabaseUrl) {
        totalFailed++;
        continue;
      }

      totalUploaded++;
      console.log(`  ✅ Uploaded successfully: ${supabaseUrl}`);
    }

    // Replace references in code
    console.log(`  🔍 Searching for references...`);
    
    // Get all possible paths that might reference this file
    const oldPaths = [
      `/assets/brandstory/${path.basename(fileInfo.originalPath)}`,
      `assets/brandstory/${path.basename(fileInfo.originalPath)}`,
      fileInfo.originalPath.replace('public/', ''),
    ];
    
    // Also add URL-encoded versions
    oldPaths.push(...oldPaths.map(p => encodeURI(p)));
    
    const replacements = await replaceReferences(oldPaths, supabaseUrl, sourceFiles);
    totalReplacements += replacements;

    if (replacements > 0) {
      console.log(`  ✅ Updated ${replacements} reference(s) in code`);
    } else {
      console.log(`  ℹ️  No references found in code (may already use Supabase URL)`);
    }

    // Delete local file
    try {
      fs.unlinkSync(fullPath);
      console.log(`  🗑️  Deleted local file: ${fileInfo.originalPath}`);
    } catch (error: any) {
      console.error(`  ⚠️  Failed to delete local file: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary');
  console.log('='.repeat(60));
  console.log(`✅ Uploaded: ${totalUploaded}`);
  console.log(`❌ Failed: ${totalFailed}`);
  console.log(`📝 Code replacements: ${totalReplacements}`);
  console.log('='.repeat(60));
  console.log('\n✅ Migration complete!');
}

// Run migration
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

