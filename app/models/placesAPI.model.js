var request = require('request');


function queryplacesApi(api_key,typeofvenue, lat, lng, resolve){

	console.log("inside function")

	var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lng+'&radius=1000&types='+typeofvenue+'&key='+api_key;

    request.post( url, {}, function(err,response,body){
		
		if(err){
			console.log("err", err)
		}
		if (!err){
			//console.log("body", body)
			resolve(JSON.parse(body));
		}
		
    })
}


function geocoderApi(lat, lng, resolve){

	console.log("starting geocoder query")

	var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=true'

    console.log("urlstring: ", url)

    request.post( url, {}, function(err,response,body){
		
		if(err){
			console.log("err", err)
		}
		if (!err){
			//console.log("body", body)
			resolve(JSON.parse(body));
		}
		
    })
}



function queryPlaces(lat, lng, finalresolve){

	console.log("started query places function")

    var api_key = "AIzaSyD_uTMhCR43ITM0CCXrbWDGR8UC68_QDnI";

	var places_results  = {bars: {},nightclubs: {}}

	new Promise(function(resolve, reject){
		queryplacesApi(api_key,"bar", lat, lng, resolve)
	}).then(function(fromResolve_bars){
	    places_results.bars = fromResolve_bars;
    }).then(function(){

	    new Promise(function(resolve, reject){
	    	queryplacesApi(api_key,"bar", lat, lng, resolve)
	    }).then(function(fromResolve_nightclubs){
	        places_results.nightclubs =  fromResolve_nightclubs;
	    }).then(function(){

            finalresolve(places_results)

	    })

	})
}


function nearestCity(lat,lng, resolve){
	geocoderApi(lat,lng, resolve)
} 

module.exports = {
  queryPlaces: queryPlaces,
  nearestCity: nearestCity
};





