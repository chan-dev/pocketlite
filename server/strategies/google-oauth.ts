import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import config from '../config/keys';

export default (): void => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.oauth2.google.clientId,
        clientSecret: config.oauth2.google.clientSecret,
        callbackURL: '/api/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        // TODO: use findOrCreate
        return done('', profile);
      }
    )
  );

  // TODO: remove both methods since we'll be using JWT
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
