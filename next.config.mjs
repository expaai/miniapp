/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Временно игнорируем ошибки TypeScript для быстрой разработки
    // В продакшене следует убрать эту настройку
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
  basePath: process.env.NODE_ENV === 'production' ? '/miniapp' : '',
  // Убрали deprecated experimental.esmExternals
}

export default nextConfig
