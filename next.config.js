/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Proxy WebSocket connections to Django backend
      {
        source: '/ws/:path*',
        destination: 'http://localhost:8000/ws/:path*',
      },
    ]
  },
}

module.exports = nextConfig