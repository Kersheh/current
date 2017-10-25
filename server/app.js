const express = require('express');
const http = require('http');
const routes = require('~/handlers');
const SocketManager = require('~/helpers/socketManager');
const databaseClient = require('~/helpers/databaseHelper');
const syncLibrary = require('~/helpers/syncLibrary');

const app = express();
const server = http.createServer(app);
const sockets = new SocketManager(server);

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
    server.listen(3000, () => {
      console.log('Server running on 3000');
    });
  })
  .catch(() => {
    console.log('\x1b[31m', 'SEVERE ERROR: Server restart required.');
  });

sockets.io.on('connect', (socket) => {
  console.log('socket connected')
});

process.on('SIGINT', () => {
  console.log('\nserver shutting down...');
  return databaseClient.mongoPromise.then((db) => {
    console.log('database shutting down...');
    return db.close();
  });
});
