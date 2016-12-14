var locationlog = require('../models/location.server.model.js');

var connect = function(socket,io){

	console.log("connect - new connection", socket.conn.id)

	    socket.on('message', function(message){
	      console.log("socket user: "+ message.username +" - sent a message, ", message.message, "geocoords: ", message.geocoords)
	        
	        if (message.hasOwnProperty("geocoords")){
	          console.log("geocoords from ("+message.username+") been recieved")


	            locationlog.create({username: message.username, geocoords: message.geocoords, timestamp: new Date()}, function(err, log) {
				    if(err) {
				      console.log(err)
				      console.log("location log error -", err.toString());
				    }
				    if(log){
				       console.log("location logged to database", log)

				       getlastlocations(io)
				    }
				  });
	        }

	})

}

var getlastlocations = function(io){
	console.log('io', io)
	console.log("get lastlocations")
    io.emit("the last locations are")
}


module.exports = {
  connect: connect
};