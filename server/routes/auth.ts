import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import mongodb from 'mongodb';

import config from '../config/keys';
import { ApiError } from '../classes/error';

const router = express.Router();

const refreshTokens = new Map();

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

    // NOTE: req.user here is Mongoose document w/c is extracted from
    // the passport google's serializerUser done(null, user) callback
    const token = jwt.sign((req.user as any).toJSON(), secretKey);

    res.cookie(config.jwt.cookieName, token, {
      httpOnly: true,
      maxAge: config.jwt.accessTokenExpiry,
    });

    const refreshToken = req.user;
    const refTokenId = new mongodb.ObjectID().toHexString();
    refreshTokens.set(refTokenId, refreshToken);

    res.cookie(config.csurf.cookieName, req.csrfToken(), {
      maxAge: config.csurf.csrfTokenExpiry,
    });
    res.cookie(config.jwt.refreshTokenCookieName, refTokenId, {
      maxAge: config.jwt.refreshTokenExpiry,
      httpOnly: true,
    });
    res.redirect(redirectUrl);
  }
);

router.post('/refresh', (req: Request, res: Response, next: NextFunction) => {
  const refreshTokenId = req.cookies[config.jwt.refreshTokenCookieName];

  // TODO: make a function for this
  // NOTE: refreshToken is stored in cookie so if it expires
  // the cookie is deleted in the client so we basically just
  // check if refreshTokenId exist
  if (refreshTokenId && refreshTokens.has(refreshTokenId)) {
    const refreshToken = refreshTokens.get(refreshTokenId);
    const {
      jwt: { secretKey },
    } = config;

    const token = jwt.sign(refreshToken.toJSON(), secretKey);

    res.cookie(config.jwt.cookieName, token, {
      httpOnly: true,
      maxAge: config.jwt.accessTokenExpiry,
    });
    res.status(200).json({
      token,
    });
  } else {
    return next(ApiError.refreshTokenExpired('Refresh Token expired'));
  }
});

router.post('/logout', (req: Request, res: Response) => {
  const refreshToken = req.cookies[config.jwt.refreshTokenCookieName];

  if (refreshTokens.has(refreshToken)) {
    refreshTokens.delete(config.jwt.refreshTokenCookieName);
  }

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
  res.clearCookie(config.jwt.refreshTokenCookieName, {
    maxAge: 0,
    httpOnly: true,
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
    // NOTE: we no longer need to acquire the cookie
    // on frontend since it's automatically passed in request
    // and in the backend, the cookie-parser with extract the jwt
    return res.json({ user: req.user });
  },
  // error handler with failWithError enabled
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    next(ApiError.unauthenticated('Jwt authentication error'));
  }
);

router.get('/error', (req: Request, res: Response) => {
  throw ApiError.unauthenticated('Login failed');
});

export default router;
