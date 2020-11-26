require('module-alias/register');
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import mongoose from 'mongoose';
import cors from 'cors';
import csurf from 'csurf';

import config from './config/keys';
import googleOauth2Setup from './strategies/google-oauth';
import jwtSetup from './strategies/jwt';
import authRoutes from './routes/auth';
import bookmarkRoutes from './routes/bookmarks';
import tagRoutes from './routes/tags';
import * as error from './middlewares/error';
import csurfHandler from './middlewares/csurf';

const app = express();
const db = mongoose.connection;
mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc: any, converted: any) => {
    delete converted._id;
    delete converted.__v;
  },
});

db.on('error', () => {
  console.error('connection error:');
  process.exit(1);
});
db.once('open', () => {
  console.log('db has been connected');
});

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const CLIENT_PATH = path.join(__dirname, process.env.CLIENT_PATH as string);

mongoose.connect(config.mongoose.dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.set('debug', NODE_ENV !== 'production');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// populate req.cookies
app.use(cookieParser());

// app.use(cors());
app.use(passport.initialize());
// TODO: remove this since we'll use JWT
// check if we disable this, will serializeUser and deserializeUser be called
app.use(passport.session());
// TODO: use only it as route middleware?
// https://medium.com/@d.silvas/how-to-implement-csrf-protection-on-a-jwt-based-app-node-csurf-angular-bb90af2a9efd
app.use(csurfHandler(csurf({ cookie: true })));

const corsConfig = {
  // TODO: update this one
  // frontend domain
  origin: config.allowedDomain, // allow to server to accept request from different origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  // Configures the Access-Control-Allow-Credentials CORS header.
  credentials: true, // allow session cookie from browser to pass thru
};
/* app.options('*', cors(corsConfig)); */
app.use(cors(corsConfig));

googleOauth2Setup();
jwtSetup();

// Client public assets folder
app.use(express.static(CLIENT_PATH));

app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/tags', tagRoutes);

app.use('/', (req, res) => {
  res.sendFile(CLIENT_PATH + '/index.html');
});

app.use(error.notFound);
app.use(error.transformUncaughtExceptions);
app.use(error.errorHandler);

app.listen(PORT, () => {
  console.log(`App listening to server ${PORT} in ${NODE_ENV} mode`);
});
