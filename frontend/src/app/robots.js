export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://atms.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/portal/*',     // Block private trading dashboard
        '/api/*',        // Block backend API proxy routes
        '/admin/*',      // Block any admin routes
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
