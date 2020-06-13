import express, { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import config from '../config/keys';

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
        userId: req.user,
      },
      secretKey
    );

    // send a cookie to the client
    // TODO: how does path work here?i
    res.cookie(config.jwt.cookieName, token);
    res.redirect(redirectUrl);
  }
);

router.get('/logout', (req: Request, res: Response) => {
  req.logout();
  // res.cookie(config.session.cookieName, { expires: Date.now() });
  res.redirect(config.redirectUrl);
});

// TODO: request this on client
router.get(
  '/token',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    console.log('we still access this route');
    return res.json({
      error: false,
      message: 'Token fetched',
      user: req.user,
    });
  }
);

router.get('/error', (req: Request, res: Response) => {
  res.status(401).json({
    error: true,
    message: 'login failed',
  });
});

export default router;
