var locationlog = require('../models/location.server.model.js');
var placesAPI = require('../models/placesAPI.model.js');
var newconnection = require('../models/socket.newconnection.model.js');
var request = require('request');
var fetch = require('node-fetch');

var connect = function(socket,io){

	console.log("connect - new connection", socket.conn.id)

	socket.on('newconnection', function(message){
		console.log("user socket message: ", message);
		
		newconnection.newconnection(socket, io, message)
	})

	socket.on('chatmessage', function(message){
		console.log("message",message)
		var inCity = message.inCity;
		var timestamp = message.timestamp.toString()

		io.to(inCity).emit('message',{message: message.text, username: message.username, timestamp: timestamp})
	})

}




module.exports = {
  connect: connect
};