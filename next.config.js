/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Proxy API requests to Django backend
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
      // Proxy WebSocket connections
      {
        source: '/ws/:path*',
        destination: 'http://localhost:8000/ws/:path*',
      },
    ]
  },
}

module.exports = nextConfig