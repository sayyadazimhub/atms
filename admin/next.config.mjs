/** @type {import('next').NextConfig} */
const apiServerUrl = (
  process.env.API_SERVER_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://atms-api.vercel.app'
    : 'http://localhost:5000')
).replace(/\/+$/, '');
const adminOrigin = (
  process.env.NEXT_PUBLIC_ADMIN_ORIGIN ||
  (process.env.NODE_ENV === 'production'
    ? 'https://admin-atms.vercel.app'
    : 'http://localhost:5000')
).replace(/\/+$/, '');

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: adminOrigin,
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

export default nextConfig;
