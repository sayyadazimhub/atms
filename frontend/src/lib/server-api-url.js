const serverApiUrl = process.env.API_SERVER_URL || (
  process.env.NODE_ENV === 'production'
    ? 'https://atms-api.vercel.app'
    : 'http://localhost:5000'
);

export default serverApiUrl;
