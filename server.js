//express 				= require('./config/express');
app						= require('./config/express');
var	express 		= require('express'),
	app           	= express(),
	server          = require('http').createServer(app),
	morgan 			= require('morgan'),
	mongoose      = require('mongoose'),
	cors          = require('cors'),
	port          = process.env.PORT || 80;
	bodyParser		= require('body-parser'),
	methodOverride	= require('method-override'),
	jwt           = require('jsonwebtoken'),
	router        = require('./app/routes/routes'),
	socketsController = require('./app/controllers/socketsController'),
	secret        = require('./config/tokens').secret,
	io            = require('socket.io')(server);

	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(bodyParser.json());
	app.use(methodOverride());



	app.use(cors());
	app.use(morgan('dev'));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	//app.get('*',function(req,res){
 	// res.sendfile('index.html');
//	});

    /*io.on('connection', function(socket){
    	console.log("connection - new connection", socket.conn.id)
    })*/

    io.on('connect', function(socket){
    	socketsController.connect(socket,io)
    })

	app.use('/app', express.static('./public'));

	//app.use(express.static('./public'));

	app.use('/api', router);
	//require('./socketio')(server, io, mongoStore);

	server.listen(port, function() {
	  console.log("Express is listening on port " + port);
	});

module.exports = {
  server: server
};