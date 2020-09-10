const accessTokenExpiry = 0;
const refreshTokenExpiry = 0;
const csrfTokenExpiry = 0;

export default {
  port: 3000,
  oauth2: {
    google: {
      clientId: 'your_client_id',
      clientSecret: 'your_client_secret',
    },
  },
  session: {
    cookieKey: '',
    cookieName: '',
  },
  jwt: {
    secretKey: '',
    cookieName: '',
    accessTokenExpiry,
    refreshTokenExpiry,
    refreshTokenCookieName: '',
  },
  csurf: {
    cookieName: '',
    csrfTokenExpiry,
  },
  mongoose: {
    dbUrl: '',
  },
  redirectUrl: 'client_url/auth/callback', // client url where the server will redirect to once authenticated
  allowedDomain: 'client_url',
};
