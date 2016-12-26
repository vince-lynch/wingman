var locationlog = require('../models/location.server.model.js');
var placesAPI = require('../models/placesAPI.model.js');
var newconnection = require('../models/socket.newconnection.model.js');
var messagesController = require('../controllers/messagesController.js');
var usersController = require('../controllers/users.server.controller');
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
 
        messagesController.insertMessage(message.username, message.timestamp,  message.text, inCity, message.avatar);

		io.to(inCity).emit('message',{message: message.text, username: message.username, timestamp: timestamp, avatar: message.avatar})
	})


	socket.on('checkin', function(message){
		console.log("message",message)

		console.log("!!! THIS IS MESSAGE.VENUE: ", message.venue)

		console.log("!!!--------------------!!!")

		var venue = message.venue//.checkinTime = Date.now();
        
        usersController.updateCheckin(message.username, message.venue);

        var inCity = message.inCity;
		io.to(inCity).emit('message',{message: message.text, username: message.username, timestamp: Date.now(), avatar: message.avatar})	
	})

}




module.exports = {
  connect: connect
};