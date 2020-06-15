import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';

import config from '../config/keys';
import User from '../models/user';
import { ApiError } from '../helpers/error-handler';

export default (): void => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.oauth2.google.clientId,
        clientSecret: config.oauth2.google.clientSecret,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const currentUser = await User.findOne({
            googleId: profile.id,
          }).exec();

          if (currentUser) {
            return done('', currentUser);
          }

          const { id, displayName, provider, _json } = profile;
          const newUser = new User({
            googleId: id,
            displayName,
            provider,
            email: _json.email,
            thumbnail: _json.picture,
          });

          await newUser.save();
          done('', newUser);
        } catch (err) {
          // TODO: improve error here
          // use appropriate code and error message
          done(ApiError.internalServerError('Unexpected Error'), null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    // NOTE: we use JWT w/c is self-contained data. In our use-case
    // we'll just depend on the JWT, so we pass the entire user data
    // if you use cookieSession, you need to pass just the id and use deserializeUser
    // to query the document in the database
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
