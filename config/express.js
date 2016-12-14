var	express 		= require('express'),
	app           	= express(),
	morgan 			= require('morgan'),
	mongoose      = require('mongoose'),
	cors          = require('cors'),
	port          = process.env.PORT || 3000;
	bodyParser		= require('body-parser'),
	methodOverride	= require('method-override'),
	jwt           = require('jsonwebtoken'),
	router        = require('../app/routes/routes'),
	secret        = require('./tokens').secret;


	mongoose.connect('mongodb://localhost/live-guard');


	module.exports = app;

