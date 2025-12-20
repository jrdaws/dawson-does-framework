/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'output: export' for Vercel deployment
  // Vercel handles Next.js natively
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
