/**
 * Utility functions for working with Supabase Storage media URLs
 * 
 * After migrating media to Supabase, use these functions to get the correct URLs
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME || 'media';

/**
 * Get the full Supabase Storage URL for a media file
 * 
 * @param path - The path to the media file (e.g., "/hero/video.mp4" or "hero/video.mp4")
 * @returns The full Supabase Storage public URL
 * 
 * @example
 * ```tsx
 * const videoUrl = getMediaUrl("/hero/video.mp4");
 * // Returns: "https://your-project.supabase.co/storage/v1/object/public/media/hero/video.mp4"
 * ```
 */
export function getMediaUrl(path: string): string {
  // Remove leading slash if present for consistency
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If Supabase URL is not configured, return original path (fallback to local)
  if (!SUPABASE_URL) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL is not set. Using local path:', path);
    return path.startsWith('/') ? path : `/${path}`;
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${cleanPath}`;
}

/**
 * Check if a path should use Supabase Storage
 * Set NEXT_PUBLIC_USE_SUPABASE_MEDIA=true to enable Supabase URLs
 */
export function shouldUseSupabase(): boolean {
  return process.env.NEXT_PUBLIC_USE_SUPABASE_MEDIA === 'true';
}

/**
 * Get media URL with automatic fallback
 * Uses Supabase if enabled, otherwise uses local path
 * 
 * @param path - The path to the media file
 * @returns The media URL (Supabase or local)
 */
export function getMediaUrlWithFallback(path: string): string {
  if (shouldUseSupabase()) {
    return getMediaUrl(path);
  }
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Get multiple media URLs at once
 * 
 * @param paths - Array of media file paths
 * @returns Array of media URLs
 */
export function getMediaUrls(paths: string[]): string[] {
  return paths.map(path => getMediaUrlWithFallback(path));
}

