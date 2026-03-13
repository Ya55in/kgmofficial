const withNextIntl = require('next-intl/plugin')(
  './src/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Netlify (works without plugin)
  // This generates a fully static site that can be deployed without server-side rendering
  output: 'export',
  // Skip generating static pages for routes that don't need locale
  generateBuildId: async () => {
    return 'build-' + Date.now().toString()
  },
  // App Router is now stable in Next.js 14+
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Handle missing images gracefully
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Disable image optimization for static export
    unoptimized: true,
    // Increase timeout for image processing
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Optimize bundle size for Netlify
  experimental: {
    // instrumentationHook removed - not needed without the Netlify plugin
    serverComponentsExternalPackages: ['sharp', '@supabase/supabase-js'],
  },
  // Reduce bundle size
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude heavy dependencies from server bundle
      config.externals = config.externals || [];
      config.externals.push({
        'sharp': 'commonjs sharp',
      });
    }
    return config;
  },
}

module.exports = withNextIntl(nextConfig) 