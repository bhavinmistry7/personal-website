import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' }],
  },
  // Old multi-page URLs land on the matching chapter
  async redirects() {
    return [
      { source: '/work',    destination: '/#work',        permanent: true },
      { source: '/media',   destination: '/#photography', permanent: true },
      { source: '/vault',   destination: '/#favorites',   permanent: true },
      { source: '/contact', destination: '/#book',        permanent: true },
    ]
  },
}

export default nextConfig
