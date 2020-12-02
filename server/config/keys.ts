// 30 min (expiresIn in jwt is in seconds)
const accessTokenExpiry = 3600;
// 1 day (in ms)
const refreshTokenExpiry = 24 * 60 * 60 * 1000;
// 1 day (in ms)
const csrfTokenExpiry = 24 * 60 * 60 * 1000;

export default {
  port: process.env.PORT || 3000,
  oauth2: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY || '',
    cookieName: process.env.JWT_ACCESS_TOKEN_COOKIE || '',
    accessTokenExpiry,
    refreshTokenExpiry,
    refreshTokenCookieName: process.env.JWT_REFRESH_TOKEN_COOKIE || '',
  },
  csurf: {
    cookieName: 'XSRF-TOKEN',
    csrfTokenExpiry,
  },
  mongoose: {
    dbUrl: process.env.DB_URL || '',
  },
  redirectUrl: process.env.REDIRECT_URL || '',
  allowedDomain: process.env.ALLOWED_DOMAIN || '',
};
