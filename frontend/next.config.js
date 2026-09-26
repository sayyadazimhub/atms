/** @type {import('next').NextConfig} */
const apiServerUrl = process.env.API_SERVER_URL || (
  process.env.NODE_ENV === 'production'
    ? 'https://atms-api.vercel.app'
    : 'http://localhost:5000'
);
const frontendOrigin = process.env.NEXT_PUBLIC_FRONTEND_ORIGIN || (
  process.env.NODE_ENV === 'production'
    ? 'https://atms1.vercel.app'
    : 'http://localhost:5000'
);

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: frontendOrigin,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiServerUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
