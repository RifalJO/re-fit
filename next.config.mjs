/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.dapurumami.com',
        pathname: '/uploads/recipe/**',
      },
      {
        protocol: 'https',
        hostname: 'img.dapurumami.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
