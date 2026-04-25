/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. REWRITES: Proxy /api requests to your FastAPI backend
  // This allows you to call fetch('/api/generate-quiz') 
  // instead of 'http://localhost:8000/api/generate-quiz'
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // Your FastAPI port
      },
    ];
  },

  // 2. IMAGE CONFIG: Allow images from your local server or cloud storage
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF is the 2026 standard for speed
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**', // For displaying images saved by your Python backend
      },
    ],
  },

  // 3. 2026 PERFORMANCE: Enable the latest React & Bundler optimizations
  experimental: {
    reactCompiler: true, // Automates memoization; no more useMemo/useCallback!
    turbopackFileSystemCache: true, // Huge dev speed boost
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'], // Shrinks your bundle
  },

  // 4. MANTINE SUPPORT: Standard for v7+
  reactStrictMode: true,
};

export default nextConfig;