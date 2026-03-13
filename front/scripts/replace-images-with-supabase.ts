#!/usr/bin/env tsx

/**
 * Script to replace local image paths with Supabase URLs and delete local files
 * 
 * This script:
 * 1. Reads the supabase-url-mapping.json file
 * 2. Finds all image/video references in source files
 * 3. Replaces them with Supabase URLs from the mapping
 * 4. Deletes local files after they've been replaced
 * 
 * Usage:
 *   npm run replace:images
 * 
 * Requirements:
 *   - supabase-url-mapping.json file exists
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
const MAPPING_FILE = path.join(ROOT_DIR, 'supabase-url-mapping.json');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SRC_DIR = path.join(ROOT_DIR, 'src');

// Check for dry-run flag
const DRY_RUN = process.argv.includes('--dry-run') || process.argv.includes('-d');

// File extensions to search
const SOURCE_EXTENSIONS = ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js', '**/*.css'];
const EXCLUDE_PATTERNS = ['node_modules', '.next', 'dist', 'build', '*.backup'];

interface Replacement {
  localPath: string;
  supabaseUrl: string;
  filesUpdated: string[];
}

interface Stats {
  totalReplacements: number;
  filesModified: number;
  filesDeleted: number;
  errors: Array<{ file: string; error: string }>;
  skipped: string[];
}

/**
 * Load the URL mapping from JSON file
 */
function loadUrlMapping(): Record<string, string> {
  if (!fs.existsSync(MAPPING_FILE)) {
    console.error(`❌ Error: Mapping file not found at ${MAPPING_FILE}`);
    process.exit(1);
  }

  const mappingContent = fs.readFileSync(MAPPING_FILE, 'utf-8');
  return JSON.parse(mappingContent);
}

/**
 * Normalize path for comparison (handles URL encoding and path separators)
 */
function normalizePath(p: string): string {
  // Remove leading slash
  let normalized = p.startsWith('/') ? p.slice(1) : p;
  // Decode URL encoding
  normalized = decodeURIComponent(normalized);
  // Normalize path separators
  normalized = normalized.replace(/\\/g, '/');
  return normalized.toLowerCase();
}

/**
 * Find all image/video references in a file
 */
function findMediaReferences(content: string, filePath: string): string[] {
  const references: string[] = [];
  
  // Patterns to match:
  // 1. src="/path/to/image.jpg"
  // 2. src='/path/to/image.jpg'
  // 3. src={"/path/to/image.jpg"}
  // 4. src={'/path/to/image.jpg'}
  // 5. src={`/path/to/image.jpg`}
  // 6. <source src="/path/to/video.mp4">
  // 7. backgroundImage: url('/path/to/image.jpg')
  // 8. background-image: url('/path/to/image.jpg')
  // 9. Variables containing paths: "/path/to/image.jpg"
  
  const patterns = [
    /src=["']([^"']+)["']/g,  // src="/path" or src='/path'
    /src=\{["']([^"']+)["']\}/g,  // src={"/path"} or src={'/path'}
    /src=\{`([^`]+)`\}/g,  // src={`/path`}
    /<source\s+src=["']([^"']+)["']/g,  // <source src="/path">
    /backgroundImage:\s*url\(["']([^"']+)["']\)/g,  // backgroundImage: url('/path')
    /background-image:\s*url\(["']([^"']+)["']\)/g,  // background-image: url('/path')
    /["'](\/[^"']+\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov|avi|mp3|wav|ogg|m4a))["']/g,  // String literals with media extensions
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const path = match[1];
      // Only include paths that start with / and are in public directory
      if (path.startsWith('/') && !path.startsWith('//') && !path.startsWith('http')) {
        references.push(path);
      }
    }
  });

  return Array.from(new Set(references)); // Remove duplicates
}

/**
 * Replace media references in a file
 */
function replaceMediaInFile(filePath: string, mapping: Record<string, string>, stats: Stats): boolean {
  const content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content;
  let modified = false;
  const references = findMediaReferences(content, filePath);

  references.forEach(localPath => {
    // Try exact match first
    if (mapping[localPath]) {
      const supabaseUrl = mapping[localPath];
      
      // Replace all occurrences in the file
      // Handle different quote styles and contexts
      const replacements = [
        [`src="${localPath}"`, `src="${supabaseUrl}"`],
        [`src='${localPath}'`, `src='${supabaseUrl}'`],
        [`src={"${localPath}"}`, `src={"${supabaseUrl}"}`],
        [`src={'${localPath}'}`, `src={'${supabaseUrl}'}`],
        [`src={\`${localPath}\`}`, `src={\`${supabaseUrl}\`}`],
        [`<source src="${localPath}"`, `<source src="${supabaseUrl}"`],
        [`<source src='${localPath}'`, `<source src='${supabaseUrl}'`],
        [`backgroundImage: url('${localPath}')`, `backgroundImage: url('${supabaseUrl}')`],
        [`backgroundImage: url("${localPath}")`, `backgroundImage: url("${supabaseUrl}")`],
        [`background-image: url('${localPath}')`, `background-image: url('${supabaseUrl}')`],
        [`background-image: url("${localPath}")`, `background-image: url("${supabaseUrl}")`],
        [`"${localPath}"`, `"${supabaseUrl}"`],  // String literal replacement (be careful with this)
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
      const normalizedLocal = normalizePath(localPath);
      const matchingKey = Object.keys(mapping).find(key => 
        normalizePath(key) === normalizedLocal
      );
      
      if (matchingKey) {
        const supabaseUrl = mapping[matchingKey];
        const replacements = [
          [`src="${localPath}"`, `src="${supabaseUrl}"`],
          [`src='${localPath}'`, `src='${supabaseUrl}'`],
          [`src={"${localPath}"}`, `src={"${supabaseUrl}"}`],
          [`src={'${localPath}'}`, `src={'${supabaseUrl}'}`],
          [`src={\`${localPath}\`}`, `src={\`${supabaseUrl}\`}`],
          [`<source src="${localPath}"`, `<source src="${supabaseUrl}"`],
          [`<source src='${localPath}'`, `<source src='${supabaseUrl}'`],
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
        // File not in mapping - might not be uploaded yet
        if (!stats.skipped.includes(localPath)) {
          stats.skipped.push(localPath);
        }
      }
    }
  });

  if (modified) {
    if (DRY_RUN) {
      // In dry-run, don't actually write the file
      stats.filesModified++;
      return true;
    }
    
    fs.writeFileSync(filePath, newContent, 'utf-8');
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

  return Array.from(new Set(files)); // Remove duplicates
}

/**
 * Delete local file after replacement
 */
function deleteLocalFile(localPath: string, stats: Stats): void {
  // Remove leading slash
  const relativePath = localPath.startsWith('/') ? localPath.slice(1) : localPath;
  const filePath = path.join(PUBLIC_DIR, relativePath);

  if (fs.existsSync(filePath)) {
    if (DRY_RUN) {
      console.log(`  🔍 [DRY-RUN] Would delete: ${relativePath}`);
      stats.filesDeleted++;
      return;
    }
    
    try {
      fs.unlinkSync(filePath);
      stats.filesDeleted++;
      console.log(`  🗑️  Deleted: ${relativePath}`);
    } catch (error: any) {
      stats.errors.push({
        file: relativePath,
        error: `Failed to delete: ${error.message}`,
      });
      console.error(`  ❌ Failed to delete ${relativePath}: ${error.message}`);
    }
  } else {
    // File might already be deleted or doesn't exist
    console.log(`  ⚠️  File not found (may already be deleted): ${relativePath}`);
  }
}

/**
 * Track which files have been replaced
 */
async function trackReplacedFiles(mapping: Record<string, string>, stats: Stats): Promise<Set<string>> {
  const replacedFiles = new Set<string>();
  
  // Get all source files
  const sourceFiles = await getSourceFiles();
  console.log(`\n📂 Found ${sourceFiles.length} source files to process\n`);

  // Process each file
  for (let index = 0; index < sourceFiles.length; index++) {
    const filePath = sourceFiles[index];
    const relativePath = path.relative(ROOT_DIR, filePath);
    console.log(`[${index + 1}/${sourceFiles.length}] Processing: ${relativePath}`);
    
    try {
      // Get media references before replacement
      const contentBefore = fs.readFileSync(filePath, 'utf-8');
      const referencesBefore = findMediaReferences(contentBefore, filePath);
      
      const wasModified = replaceMediaInFile(filePath, mapping, stats);
      
      if (wasModified) {
        console.log(`  ✅ Updated with Supabase URLs`);
        
        // Track which files were replaced
        referencesBefore.forEach(ref => {
          if (mapping[ref] || Object.keys(mapping).find(key => normalizePath(key) === normalizePath(ref))) {
            replacedFiles.add(ref);
          }
        });
      } else {
        console.log(`  ℹ️  No changes needed`);
      }
    } catch (error: any) {
      stats.errors.push({
        file: relativePath,
        error: error.message,
      });
      console.error(`  ❌ Error: ${error.message}`);
    }
  }

  return replacedFiles;
}

/**
 * Main function
 */
async function main() {
  if (DRY_RUN) {
    console.log('🔍 DRY-RUN MODE: No files will be modified or deleted\n');
  }
  
  console.log('🚀 Starting image replacement with Supabase URLs...\n');

  // Load mapping
  console.log('📖 Loading URL mapping...');
  const mapping = loadUrlMapping();
  console.log(`✅ Loaded ${Object.keys(mapping).length} URL mappings\n`);

  // Initialize stats
  const stats: Stats = {
    totalReplacements: 0,
    filesModified: 0,
    filesDeleted: 0,
    errors: [],
    skipped: [],
  };

  // Track replaced files and update source files
  const replacedFiles = await trackReplacedFiles(mapping, stats);

  // Delete local files that have been replaced
  // Only delete files that were actually found and replaced in the code
  console.log('\n🗑️  Deleting local files that have been replaced...\n');
  const processedFiles = new Set<string>();
  
  // Delete files that were replaced in source code
  replacedFiles.forEach(localPath => {
    if (!processedFiles.has(localPath)) {
      deleteLocalFile(localPath, stats);
      processedFiles.add(localPath);
    }
  });
  
  console.log(`\n✅ Deletion complete. Processed ${processedFiles.size} files.`);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Replacement Summary');
  console.log('='.repeat(60));
  console.log(`Total replacements: ${stats.totalReplacements}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Files deleted: ${stats.filesDeleted}`);
  console.log(`Skipped (not in mapping): ${stats.skipped.length}`);
  console.log(`Errors: ${stats.errors.length}`);
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

  if (stats.skipped.length > 0) {
    console.log(`\n⚠️  Skipped ${stats.skipped.length} files not found in mapping:`);
    stats.skipped.slice(0, 10).forEach(path => {
      console.log(`  - ${path}`);
    });
    if (stats.skipped.length > 10) {
      console.log(`  ... and ${stats.skipped.length - 10} more`);
    }
  }

  if (DRY_RUN) {
    console.log('\n✅ DRY-RUN complete! No files were actually modified or deleted.');
    console.log('   Run without --dry-run to apply changes.');
  } else {
    console.log('\n✅ Replacement complete!');
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

