/** @type {import('next').NextConfig} */
import { createProxyMiddleware } from 'http-proxy-middleware';
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*', // Memproxy permintaan ke /api ke server lokal
        destination: 'http://localhost:3000/api/:path*', // Ganti dengan URL API lokal Anda
      },
    ];
  },

  webpack(config) {
    config.resolve.fallback = { fs: false }; // Menangani fallback fs jika dibutuhkan
    return config;
  },
};

export default nextConfig;
