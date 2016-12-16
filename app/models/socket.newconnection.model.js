var locationlog = require('../models/location.server.model.js');
var placesAPI = require('../models/placesAPI.model.js');
var request = require('request');
var fetch = require('node-fetch');


function newconnection(socket, io, message){

	console.log("socket user: "+ message.username +" - sent a message, ", message.message, "geocoords: ", message.geocoords)

	if (message.hasOwnProperty("geocoords")){


	console.log("geocoords from ("+message.username+") been recieved")

	//placesAPI.queryPlaces();

	var urLatLng = {lat: message.geocoords.lat, lng: message.geocoords.lng}

	new Promise(function(resolve,reject){
	placesAPI.queryPlaces(message.geocoords.lat, message.geocoords.lng, resolve);
	}).then(function(places_results){
	 //console.log("fromresolve", fromresolve)

	new Promise(function(resolve,reject){
	   
	   placesAPI.nearestCity(message.geocoords.lat, message.geocoords.lng, resolve);
	}).then(function(city_results){

		var store_location_in_db = new Promise(function(resolve, reject){

			var inCity = city_results.results[0].formatted_address;

			console.log("city_results.results[0]", inCity)

	       locationlog.create({socketid: socket.conn.id, inCity: inCity ,username: message.username, geocoords: message.geocoords, timestamp: new Date()}, function(err, log) {
			    if(err) {
			      console.log(err)
			      console.log("location log error -", err.toString());

			      reject(err) // end of promise
			    }
			    if(log){
			       console.log("location logged to database", log)
			       
			       resolve(inCity) // end of promise
			    }
			})

	    }).then(function(inCity){

	        store_location_in_db.then(function(fromResolve){

	        	console.log("got as far as here")

			    locationlog.find({inCity: inCity}, function(err, logs) {
				    if(err){
				    	console.log("error:", err );
				    }
				    if(logs){
				    	//console.log(logs)
	                    
	                    //have them join the chat for that city
						socket.join(inCity);

						io.to(inCity).emit('message',{username: "[ROOM]",message: message.username + " from " + inCity + " - has just logged in", timestamp: Date.now()})
				        io.to(socket.conn.id).emit('data', {event: 'locationupdated', city_results: city_results, places_results: places_results, lastLogs: logs, urLatLng: urLatLng, inCity: inCity } ); // message just for the logged in user

				    }
				
			   })

			}).catch(function(error) {
			  console.error(error.stack);
			});

	    })



	})


	})

	}


}

var getlastlocations = function(inCity, callback){
	//console.log('io', io)
	console.log("get lastlocations by city: " + inCity)

  //get last locations
  locationlog.find({inCity: inCity}, function(err, logs) {
    if(err){
    	console.log("error:", err );
    }
    if(logs){
    	console.log(logs)
       callback(logs); 
    }
  });
    //io.emit('message', "the last locations are")
}



module.exports = {
  newconnection: newconnection
};