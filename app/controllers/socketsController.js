var locationlog = require('../models/location.server.model.js');
var placesAPI = require('../models/placesAPI.model.js');
var request = require('request');
var fetch = require('node-fetch');

var connect = function(socket,io){

	console.log("connect - new connection", socket.conn.id)

	    socket.on('message', function(message){
	      console.log("socket user: "+ message.username +" - sent a message, ", message.message, "geocoords: ", message.geocoords)
	        
	        if (message.hasOwnProperty("geocoords")){
		        
		        console.log("geocoords from ("+message.username+") been recieved")

		        //placesAPI.queryPlaces();

		        new Promise(function(resolve,reject){
		        	placesAPI.queryPlaces(message.geocoords.lat, message.geocoords.lng, resolve);
		        }).then(function(places_results){
					 //console.log("fromresolve", fromresolve)

					new Promise(function(resolve,reject){
                       
                       placesAPI.nearestCity(message.geocoords.lat, message.geocoords.lng, resolve);
					}).then(function(city_results){

						var store_location_in_db = new Promise(function(resolve, reject){

							var inCity = city_results.results[0].address_components[2].short_name;

							console.log("city_results.results[0]", inCity)

				           locationlog.create({inCity: inCity ,username: message.username, geocoords: message.geocoords, timestamp: new Date()}, function(err, log) {
							    if(err) {
							      console.log(err)
							      console.log("location log error -", err.toString());

							      reject(err) // end of promise
							    }
							    if(log){
							       console.log("location logged to database", log)
							       
							       resolve(true) // end of promise
							    }
							})

			            }).then(function(){

				            store_location_in_db.then(function(fromResolve){

							    getlastlocations(inCity,function(lastLogs){

								 io.to(socket.conn.id).emit('message', {city_results: city_results, places_results: places_results, lastLogs: lastLogs} ); // message just for the logged in user

							   })

							})

			            })



					})


		        })

            }

	})

}

var getlastlocations = function(inCity, callback){
	//console.log('io', io)
	console.log("get lastlocations")

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
  connect: connect
};