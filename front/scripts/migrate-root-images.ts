#!/usr/bin/env tsx

/**
 * Script to migrate root-level image files (1.jpg - 7.jpg) to Supabase
 * and replace their references in code, then delete them
 * 
 * Usage:
 *   npm run migrate:root-images
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
const SRC_DIR = path.join(ROOT_DIR, 'src');

// Files to migrate
const FILES_TO_MIGRATE = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg'];

// File extensions to search in source files
const SOURCE_EXTENSIONS = ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js', '**/*.html', '**/*.css'];
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
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  return contentTypes[ext] || 'image/jpeg';
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
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Replace references in source files
 */
async function replaceReferences(
  fileName: string,
  supabaseUrl: string,
  sourceFiles: string[]
): Promise<number> {
  let replacements = 0;

  // Get all possible paths that might reference this file
  const oldPaths = [
    `/${fileName}`,
    `./${fileName}`,
    `../${fileName}`,
    fileName,
    `"${fileName}"`,
    `'${fileName}'`,
    `\`${fileName}\``,
  ];

  for (const sourceFile of sourceFiles) {
    try {
      let content = fs.readFileSync(sourceFile, 'utf-8');
      let modified = false;

      for (const oldPath of oldPaths) {
        // Patterns to replace
        const patterns = [
          [`src="${oldPath}"`, `src="${supabaseUrl}"`],
          [`src='${oldPath}'`, `src='${supabaseUrl}'`],
          [`src={"${oldPath}"}`, `src={"${supabaseUrl}"}`],
          [`src={'${oldPath}'}`, `src={'${supabaseUrl}'}`],
          [`src={\`${oldPath}\`}`, `src={\`${supabaseUrl}\`}`],
          [`<source src="${oldPath}"`, `<source src="${supabaseUrl}"`],
          [`<source src='${oldPath}'`, `<source src='${supabaseUrl}'`],
          [`<img src="${oldPath}"`, `<img src="${supabaseUrl}"`],
          [`<img src='${oldPath}'`, `<img src='${supabaseUrl}'`],
          [`image: "${oldPath}"`, `image: "${supabaseUrl}"`],
          [`image: '${oldPath}'`, `image: '${supabaseUrl}'`],
          [`url("${oldPath}")`, `url("${supabaseUrl}")`],
          [`url('${oldPath}')`, `url('${supabaseUrl}')`],
          [`backgroundImage: url("${oldPath}")`, `backgroundImage: url("${supabaseUrl}")`],
          [`backgroundImage: url('${oldPath}')`, `backgroundImage: url('${supabaseUrl}')`],
          [`background-image: url("${oldPath}")`, `background-image: url("${supabaseUrl}")`],
          [`background-image: url('${oldPath}')`, `background-image: url('${supabaseUrl}')`],
          [`"${oldPath}"`, `"${supabaseUrl}"`],
          [`'${oldPath}'`, `'${supabaseUrl}'`],
          [`\`${oldPath}\``, `\`${supabaseUrl}\``],
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
  console.log('🚀 Starting migration of root-level image files...\n');

  const sourceFiles = await getSourceFiles();
  let totalUploaded = 0;
  let totalFailed = 0;
  let totalReplacements = 0;
  let totalDeleted = 0;

  for (const fileName of FILES_TO_MIGRATE) {
    const fullPath = path.join(ROOT_DIR, fileName);
    const supabasePath = `assets/images/${fileName}`;
    
    console.log(`\n📄 Processing: ${fileName}`);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found, skipping: ${fileName}`);
      continue;
    }

    // Upload to Supabase
    console.log(`  📤 Uploading to Supabase...`);
    const supabaseUrl = await uploadFile(fullPath, supabasePath);

    if (!supabaseUrl) {
      totalFailed++;
      continue;
    }

    totalUploaded++;
    console.log(`  ✅ Uploaded successfully: ${supabaseUrl}`);

    // Replace references in code
    console.log(`  🔍 Searching for references...`);
    const replacements = await replaceReferences(fileName, supabaseUrl, sourceFiles);
    totalReplacements += replacements;

    if (replacements > 0) {
      console.log(`  ✅ Updated ${replacements} reference(s) in code`);
    } else {
      console.log(`  ℹ️  No references found in code (file may not be used)`);
    }

    // Delete local file
    try {
      fs.unlinkSync(fullPath);
      totalDeleted++;
      console.log(`  🗑️  Deleted local file: ${fileName}`);
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
  console.log(`🗑️  Files deleted: ${totalDeleted}`);
  console.log('='.repeat(60));
  console.log('\n✅ Migration complete!');
}

// Run migration
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

