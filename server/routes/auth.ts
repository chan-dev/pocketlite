import express, { Request, Response } from 'express';
import passport from 'passport';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google'),
  (req: Request, res: Response) => {
    // TODO: redirect back to our angular route?
    // res.json({
    //   user: req.user,
    // });
    res.redirect('/');
  }
);

router.get('/logout', (req: Request, res: Response) => {
  req.logout();
  res.redirect('/');
});

export default router;
