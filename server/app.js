const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('config');
const routes = require('~/handlers');
const SocketManager = require('~/helpers/socketManager');
const db = require('~/helpers/databaseManager');
const syncLibrary = require('~/helpers/syncLibrary');
const authenticationHelper = require('~/helpers/authenticationHelper');

const app = express();
const server = http.createServer(app);
const sockets = new SocketManager(server);

const PORT = config.get('SERVER.PORT');
const SECRET = config.get('SESSION.SECRET');
const MAX_AGE_HRS = config.get('SESSION.MAX_AGE_HRS');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 10000 }
}));

app.get('*', authenticationHelper.authenticate);

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
  })
  .catch(() => {
    console.log('\x1b[31m', 'SEVERE ERROR: Server restart required.');
  });

sockets.io.on('connect', (socket) => {
  // console.log('socket connected');
});

// Safely shutdown mongo database on server shutdown
process.on('SIGINT', () => {
  console.log('\nServer shutting down...');
  return db.mongoPromise.then((db) => {
    console.log('Database shutting down...');
    return db.close();
  });
});
