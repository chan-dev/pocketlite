import path from 'path';
import express, { Response, Request, NextFunction } from 'express';
import cookieSession from 'cookie-session';
import passport from 'passport';

import config from './config/keys';
import passportSetup from './helpers/passport-setup';
import authRoutes from './routes/auth';
import { handleError, AppError } from './helpers/error-handler';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  cookieSession({
    // httpOnly: true
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.session.cookieKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());

passportSetup();

app.use(express.static(path.join(__dirname, '../client/dist/pocketlite')));

app.use('/auth', authRoutes);

// app.get('/', (req: Request, res: Response, next) => {
//   res.send('node + typescript + eslint boilerplate');
// });

// defer everything else to client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/pocketlite/index.html'));
});

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  if (app.get('env') === 'development') {
    console.error(err.stack);
  }
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`App listening to server ${PORT}`);
});
