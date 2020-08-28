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
  },
  csurf: {
    cookieName: '',
  },
  mongoose: {
    dbUrl: '',
  },
  redirectUrl: 'client_url/auth/callback', // client url where the server will redirect to once authenticated
  allowedDomain: 'client_url',
};
