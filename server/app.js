const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const MemoryStore = require('session-memory-store');
const config = require('config');
const routes = require('./handlers');
const SocketManager = require('./helpers/socketManager');
const db = require('./helpers/databaseManager');
const syncLibrary = require('./helpers/syncLibrary');
const authenticationHelper = require('./helpers/authenticationHelper');

const PORT = config.get('SERVER.PORT');
const ORIGIN = config.get('SERVER.CORS.ORIGIN');
const SECRET = config.get('SESSION.SECRET');
const MAX_AGE = config.get('SESSION.MAX_AGE_HRS') * 3600000;
const COOKIE_DOMAIN = config.get('SESSION.COOKIE.DOMAIN');

const app = express();
const server = http.createServer(app);
const session = expressSession({
  store: new MemoryStore(expressSession)({
    expires: MAX_AGE
  }),
  secret: SECRET,
  saveUninitialized: true,
  resave: true,
  cookie: {
    maxAge: MAX_AGE,
    httpOnly: false,
    domain: COOKIE_DOMAIN
  }
});
const sockets = new SocketManager(server, session);

app.use(session);
app.use(cors({
  origin: ORIGIN,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  methods: ['POST', 'GET', 'OPTIONS'],
  credentials: true
}));
app.use(bodyParser.json());

app.get('*', authenticationHelper.authenticate);
sockets.io.on('connect', (socket) => {
  // console.log('socket connected');
});

// TODO: Declutter app.js with route loader
app.use('/auth', routes.auth);
app.use('/user', routes.user);
app.use('/users', routes.users);
app.use('/video', routes.video);
app.use('/videos', routes.videos);

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    status: err.status
  });
});

// Sync video library with database before starting server
syncLibrary.syncVideoLibrary()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  }).catch(() => {
    console.log('\x1b[31m', 'SEVERE ERROR: Server restart required.');
  });

// Safely shutdown mongo database on server shutdown
process.on('SIGINT', () => {
  console.log('\nServer shutting down...');
  return db.mongoPromise.then((db) => {
    console.log('Database shutting down...');
    return db.close();
  });
});
