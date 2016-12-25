var app     = require('./config/express');
var express = require('express');  
var http = require('https');  
var fs = require('fs');
var morgan  = require('morgan');
var mongoose = require('mongoose');
var cors     = require('cors');
var bodyParser    = require('body-parser');
var methodOverride  = require('method-override');
var jwt             = require('jsonwebtoken');
var router          = require('./app/routes/routes');
var socketsController = require('./app/controllers/socketsController');
var secret        = require('./config/tokens').secret;

//https://startupnextdoor.com/how-to-obtain-and-renew-ssl-certs-with-lets-encrypt-on-node-js/

//this.app = this.express();


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan('dev'));




var sslPath = './ssl/';

var options = {  
    key: fs.readFileSync(sslPath + 'privkey.pem'),
    cert: fs.readFileSync(sslPath + 'fullchain.pem')
};

var server  = http.createServer(options, app);  
var io      = require('socket.io')(server);


io.on('connect', function(socket){
    socketsController.connect(socket,io)
    io.emit("I emitted this from server.js")
  })

app.use('/app', express.static('./public'));


app.use('/api', router);


server.listen(443);  


module.exports = {
  server: server
};



//io = require('socket.io').listen(server);  



  //server          = require('https').createServer(app),
 
  //port          = process.env.PORT || 1337;
