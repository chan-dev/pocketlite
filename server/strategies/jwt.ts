import { Request } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';

import config from '../config/keys';

export default (): void => {
  const cookieExtractor = function (req: Request) {
    let token = null;
    const cookieName = config.jwt.cookieName;
    if (req && req.cookies) {
      token = req.cookies[cookieName];
    }
    return token;
  };

  const opts: StrategyOptions = {
    // we validate using the jwt from the cookie
    // no need to attach Authorization header for each client
    jwtFromRequest: cookieExtractor,
    secretOrKey: config.jwt.secretKey,
    passReqToCallback: true,
    ignoreExpiration: false,
  };
  passport.use(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new JwtStrategy(opts, function (req: Request, jwt_payload: any, done: any) {
      return done('', jwt_payload);
    })
  );
};
