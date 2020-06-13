import express, { Response, Request, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import mongoose from 'mongoose';
import cors from 'cors';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import config from './config/keys';
import passportSetup from './helpers/passport-setup';
import authRoutes from './routes/auth';
import { handleError, AppError } from './helpers/error-handler';

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

passportSetup();

// app.use(express.static(path.join(__dirname, '../client/dist/pocketlite')));

// TODO: move jwt logic to another file
const cookieExtractor = function (req: Request) {
  let token = null;
  const cookieName = config.jwt.cookieName;
  if (req && req.cookies) {
    token = req.cookies[cookieName];
  }
  return token;
};

const opts = {
  // we validate using the jwt from the cookie
  // no need to attach Authorization header for each client
  jwtFromRequest: cookieExtractor,
  secretOrKey: config.jwt.secretKey,
  passReqToCallback: true,
};
passport.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new JwtStrategy(opts, function (req: Request, jwt_payload: any, done: any) {
    console.log({
      jwt_payload,
    });
    done('', jwt_payload);
  })
);

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

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  if (app.get('env') === 'development') {
    console.error(err.stack);
  }
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`App listening to server ${PORT}`);
});
