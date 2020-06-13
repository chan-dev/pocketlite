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
  mongoose: {
    dbUrl: '',
  },
  redirectUrl: '',
  allowedDomain: '',
};
