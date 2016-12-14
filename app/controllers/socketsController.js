var locationlog = require('../models/location.server.model.js');
var http = require('http');
var fetch = require('node-fetch');

var connect = function(socket,io){

	console.log("connect - new connection", socket.conn.id)

	    socket.on('message', function(message){
	      console.log("socket user: "+ message.username +" - sent a message, ", message.message, "geocoords: ", message.geocoords)
	        
	        if (message.hasOwnProperty("geocoords")){
		        
		        console.log("geocoords from ("+message.username+") been recieved")

/*				var data = querystring.stringify({
				      username: yourUsernameValue,
				      password: yourPasswordValue
				    });*/


				    fetch('/maps/api/place/nearbysearch/json?location='+message.geocoords.lng+','+message.geocoords.lat+'&radius=500&types=bars&key=AIzaSyD_uTMhCR43ITM0CCXrbWDGR8UC68_QDnI', { method: 'POST', body: 'a=1' })
				        .then(function(res) {
				            console.log(res)
				        }).then(function(json) {
				            console.log(json);
				        });
/*
				var options = {
				    host: 'maps.googleapis.com',
				    port: 80,
				    path: 

				    method: 'POST'
				    //headers: {
				        //'Content-Type': 'application/x-www-form-urlencoded',
				        //'Content-Length': Buffer.byteLength(data)
				    //}
				};

				var req = http.request(options, function(res) {

					res.on('data', function (chunk) {
					    console.log('BODY: ' + chunk);
					 });
                     //console.log("response from http request", res)
				});*/








	            locationlog.create({username: message.username, geocoords: message.geocoords, timestamp: new Date()}, function(err, log) {
				    if(err) {
				      console.log(err)
				      console.log("location log error -", err.toString());
				    }
				    if(log){
				       console.log("location logged to database", log)

				       getlastlocations(io, socket.conn.id)
				    }
				  });
	        }

	})

}

var getlastlocations = function(io, socketid){
	//console.log('io', io)
	console.log("get lastlocations")

  //get last locations
  locationlog.find(function(err, logs) {
    if(err){
    	console.log("error:", err );
    }
    if(logs){
       io.to(socketid).emit('message', JSON.stringify(logs)); // message just for the logged in user
    }
  });
    //io.emit('message', "the last locations are")
}


module.exports = {
  connect: connect
};