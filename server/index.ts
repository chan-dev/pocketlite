import express, { Response, Request, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import mongoose from 'mongoose';
import cors from 'cors';
import csurf from 'csurf';

import config from './config/keys';
import googleOauth2Setup from './strategies/google-oauth';
import jwtSetup from './strategies/jwt';
import authRoutes from './routes/auth';
import { handleError, ApiError } from './helpers/error-handler';

const app = express();
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('db has been connected');
});

const PORT = process.env.PORT || 3000;

mongoose.connect(config.mongoose.dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// populate req.cookies
app.use(cookieParser());

// app.use(cors());
app.use(passport.initialize());
// TODO: remove this since we'll use JWT
app.use(passport.session());
// TODO: use only it as route middleware?
// https://medium.com/@d.silvas/how-to-implement-csrf-protection-on-a-jwt-based-app-node-csurf-angular-bb90af2a9efd
app.use(
  csurf({
    cookie: true,
  })
);

app.use(
  cors({
    // TODO: update this one
    // frontend domain
    origin: config.allowedDomain, // allow to server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS',
    // Configures the Access-Control-Allow-Credentials CORS header.
    credentials: true, // allow session cookie from browser to pass thru
  })
);

googleOauth2Setup();
jwtSetup();

// app.use(express.static(path.join(__dirname, '../client/dist/pocketlite')));

app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response, next) => {
  res.send('node + typescript + eslint boilerplate');
});

app.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    console.log('access granted');
  }
);

// defer everything else to client-side routing
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist/pocketlite/index.html'));
// });

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (app.get('env') === 'development') {
    console.error(err.stack);
  }
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`App listening to server ${PORT}`);
});
