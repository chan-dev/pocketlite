import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import config from '../config/keys';

export default (): void => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.oauth2.google.clientId,
        clientSecret: config.oauth2.google.clientSecret,
        callbackURL: '/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        return done('', profile);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done('', user);
  });

  passport.deserializeUser((user, done) => {
    done('', user);
  });
};
