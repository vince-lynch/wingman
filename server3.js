var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var LEX = require('letsencrypt-express').testing();
LEX.create({
  configDir: '/etc/letsencrypt'
, onRequest: server
, letsencrypt: null
, approveRegistration: function (hostname, cb) {
    cb(null, {
      domains: ['example.com']
    , email: 'info@example.com'
    , agreeTos: true
    });
  }
}).listen([80], [443, 5001], function () {
  console.log("ENCRYPT __ALL__ THE DOMAINS!");
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});