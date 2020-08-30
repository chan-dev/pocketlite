import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import config from '../config/keys';
import { ApiError } from '../helpers/error-handler';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/error',

    // TODO: is required?
    // successRedirect: config.redirectUrl,
  }),
  (req: Request, res: Response) => {
    // TODO: redirect back to our angular route?
    // create a jwt here and set in it a cookie
    const {
      jwt: { secretKey },
      redirectUrl,
    } = config;

    const token = jwt.sign(
      {
        user: req.user,
      },
      secretKey
    );

    const dayInMs = 24 * 60 * 60 * 1000;
    res.cookie(config.jwt.cookieName, token, {
      httpOnly: true,
      maxAge: dayInMs,
    });
    res.cookie(config.csurf.cookieName, req.csrfToken(), {
      maxAge: dayInMs,
    });
    res.redirect(redirectUrl);
  }
);

router.post('/logout', (req: Request, res: Response) => {
  req.logout();
  // NOTE: in order to clear cookie, the cookie must have the same configuration
  // as when you set the cookie
  res.clearCookie(config.jwt.cookieName, {
    httpOnly: true,
    maxAge: 0,
  });
  res.clearCookie(config.csurf.cookieName, {
    maxAge: 0,
  });
  // TODO: make sure the json response are consistent
  return res.json({
    message: 'Logout success',
  });
});

// TODO: request this on client
router.get(
  '/user',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  (req: Request, res: Response) => {
    console.log('we still access this route');
    // NOTE: we no longer need to acquire the cookie
    // on frontend since it's automatically passed in request
    // and in the backend, the cookie-parser with extract the jwt
    console.log({
      tokenInCookie: req.cookies['jwt'],
    });
    return res.json({ user: req.user });
  },
  // error handler with failWithError enabled
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    next(ApiError.unauthenticated('Jwt authentication error'));
  }
);

router.get('/error', (req: Request, res: Response) => {
  /* res.status(401).json({ */
  /*   error: true, */
  /*   message: 'login failed', */
  /* }); */
  // TODO: should we call next(error) here or just throw
  // since this is just an synchronous one
  throw ApiError.unauthenticated('Login failed');
});

export default router;
