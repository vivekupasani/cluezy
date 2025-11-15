/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa'
const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/vi/**'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**'
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**'
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/images/**'
      }
    ]
  },
  eslint: {
    // ✅ Prevent build from failing due to lint errors
    ignoreDuringBuilds: true
  }
}

const pdwConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true
})

export default pdwConfig(nextConfig)
