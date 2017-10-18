const express = require('express');
const http = require('http');
const routes = require('~/handlers');
const SocketManager = require('~/helpers/socketManager');

const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  next();
});

app.use('/video', routes.video);
app.use('/videos', routes.videos);

const sockets = new SocketManager(server);
sockets.io.on('connect', (socket) => {
  console.log('socket connected');
});

server.listen(3000, () => {
  console.log('Server running on 3000');
});
