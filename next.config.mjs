/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Оптимизация для Telegram Mini App
  output: 'export',
  trailingSlash: true,
  distDir: 'dist',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/miniapp' : '',
  experimental: {
    esmExternals: false,
  },
}

export default nextConfig
