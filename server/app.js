const express = require('express');
const http = require('http');
const config = require('config');
const routes = require('~/handlers');
const SocketManager = require('~/helpers/socketManager');
const db = require('~/helpers/databaseClient');
const syncLibrary = require('~/helpers/syncLibrary');

const app = express();
const server = http.createServer(app);
const sockets = new SocketManager(server);

const PORT = config.get('Server.port');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  next();
});

app.use('/video', routes.video);
app.use('/videos', routes.videos);

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
  console.log('socket connected')
});

process.on('SIGINT', () => {
  console.log('\nServer shutting down...');
  return db.mongoPromise.then((db) => {
    console.log('Database shutting down...');
    return db.close();
  });
});
