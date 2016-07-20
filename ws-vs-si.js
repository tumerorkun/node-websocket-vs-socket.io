// WebSocket vs. Socket.IO example - common backend - from:
// https://github.com/rsp/node-websocket-vs-socket.io
// Copyright (c) 2015, 2016 Rafał Pocztarski
// Released under MIT License (Expat) - see:
// https://github.com/rsp/node-websocket-vs-socket.io/blob/master/LICENSE.md

var express = require('express');
var log = function (m) {
  console.error(new Date().toISOString()+' '+this.pre+m);
}
// WebSocket:
var ws = {app: express(), pre: "websocket app: ", log: log};
ws.ws = require('express-ws')(ws.app);
ws.app.get('/', (req, res) => {
  ws.log('express connection - sending html');
  res.sendFile(__dirname + '/ws.html');
});
ws.app.ws('/', (s, req) => {
  ws.log('incoming websocket connection');
  for (var t = 0; t < 3; t++)
    setTimeout(() => {
      ws.log('sending message to client');
      s.send(ws.pre+'message from server');
    }, 1000*t);
});
ws.app.listen(3001, () =>
  ws.log('listening on http://localhost:3001/'));
ws.log('starting server');

// Socket.IO:
var si = {app: express(), pre: "socket.io app: ", log: log};
si.http = require('http').Server(si.app);
si.io = require('socket.io')(si.http);
si.app.get('/', (req, res) => {
  si.log('express connection - sending html');
  res.sendFile(__dirname + '/si.html');
});
si.io.on('connection', s => {
  si.log('incoming socket.io connection');
  for (var t = 0; t < 3; t++)
    setTimeout(() => {
      si.log('sending message to client');
      s.emit('message', si.pre+'message from server');
    }, 1000*t);
});
si.http.listen(3002, () =>
  si.log('listening on http://localhost:3002/'));
si.log('starting server');
