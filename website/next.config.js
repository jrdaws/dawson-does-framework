/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel handles Next.js natively - no need for 'output: export'
  images: {
    unoptimized: true,
  },
  trailingSlash: false, // Changed to false for API routes
}

module.exports = nextConfig
