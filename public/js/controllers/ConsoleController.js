
  function ConsoleController($scope,$http, $resource, $auth, $state, $window, Upload) {
    console.log('Main controller Angular');

    $scope.pointingtous  = false;
    $scope.authenticated = false;
    $scope.nolocation = true;
    $scope.messages = [{username: "app", message: "Loading..", timestamp: Date.now() }];
    $window.messages = [];
    $scope.inCity = "";
    $scope.texttosend = "";
   

    $scope.login = {email: "",password: "", username: ""}

    var socket = window.io();


    console.log("controller loaded");

    $scope.submit = function(file){ //function to call on form submit
      console.log("submit function called, file: ", file)
        if (file) { //check if from is valid
            $scope.upload(file); //call upload function
        }
    }
    $scope.upload = function (file) {
        Upload.upload({
            url: 'http://localhost:3000/api/upload', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) { 
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };



   $scope.isAuth = function(){
      $scope.authenticated ? '' : $state.go('login');
   }

    // sign in with facebook
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider);
    };


    $scope.helloworld = "hello world from $scope now its not even doing it";


   $scope.submitLogin = function(){
    console.log("email: ", $scope.login.email, "password: ", $scope.login.password);
    $auth.login($scope.login).then(function(response){
      console.log(response);
      $scope.authenticated = true;
      $state.go('dashboard')
      $scope.sendSocket($scope.login.username);
    })
   }

  $scope.submitRegister = function(){
    console.log("email: ", $scope.login.email, "password: ", $scope.login.password);
    $auth.signup($scope.login).then(function(response){
       console.log(response);
       $scope.authenticated = true;
       $state.go('dashboard')
       $scope.sendSocket($scope.login.username);
    })
  }

  $scope.logout = function(){
    console.log("email: ", $scope.login.email, "password: ", $scope.login.password);
    $auth.logout()
    $scope.authenticated = false;
    $state.go('login')
  }

  /// GEO LOCATION STUFF

  function getLocation(){
  var msg; 

 
  if('geolocation' in window.navigator){

    requestLocation();
  }else{
    // no geolocation :(
    msg = "Sorry, looks like your browser doesn't support geolocation";
    outputResult(msg); // output error message
    
  }

  function requestLocation(){
    /**
    getCurrentPosition() below accepts 3 arguments:
    a success callback (required), an error callback  (optional), and a set of options (optional)
    **/
  
    var options = {
      // enableHighAccuracy = should the device take extra time or power to return a really accurate result, or should it give you the quick (but less accurate) answer?
      enableHighAccuracy: false,
      // timeout = how long does the device have, in milliseconds to return a result?
      timeout: 5000,
      // maximumAge = maximum age for a possible previously-cached position. 0 = must return the current position, not a prior cached position
      maximumAge: 0
    };
  
    // call getCurrentPosition()
     window.navigator.geolocation.getCurrentPosition(success, error, options); 
  
    // upon success, do this
    function success(pos){
      // get longitude and latitude from the position object passed in


      var geocoords = {lat:  "51.4937728", lng: "-0.1422" }//{lng: pos.coords.longitude, lat: pos.coords.latitude}

      // needs to calculate nearest city using GOOGLE. (in order to create rooms/ something like that with sockets)
      //$http.post('', geocoords, config).then(successCallback, errorCallback);


      // send back their location to the server (via sockets)
      $scope.sendSocket($scope.login.username, geocoords)
      // and presto, we have the device's location!
      msg = 'You appear to be at longitude: ' +  geocoords.lng + ' and latitude: ' +  geocoords.lat  + '<img src="http://maps.googleapis.com/maps/api/staticmap?zoom=15&size=300x300&maptype=roadmap&markers=color:red%7Clabel:A%7C' + geocoords.lat + ',' + geocoords.lng+ '&sensor=false">';
      //outputResult(msg); // output message
    }
  
    // upon error, do this
    function error(err){
      // return the error message
      msg = 'Error: ' + err + ' :(';
      //outputResult(msg); // output button
      $('.pure-button').removeClass('pure-button-primary').addClass('pure-button-error'); // change button style
    }  
  } // end requestLocation();


} // end getLocation()



  // plot a map with markers of all recently logged in users
  $scope.plotusers = function(lat, lng, data){

    console.log("lat/lng", lng, lat)

    var marker_these_users = [];
    
    var i = 0;
    for (i in data.lastLogs){
      if (data.lastLogs[i].username !=  $scope.login.username){
         marker_these_users.push(data.lastLogs[i])
      }
    }
    console.log("going to add these users to the map", marker_these_users)
    $window.marker_these_users = marker_these_users;


     // map options
    var options = {
        zoom: 13,
        center: new google.maps.LatLng(lat, lng), // centered US
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        mapTypeControl: false
    };

    // init map
    var map = new google.maps.Map(document.getElementById('map-result'), options);

    // NY and CA sample Lat / Lng
    var southWest = new google.maps.LatLng(40.744656, -74.005966);
    var northEast = new google.maps.LatLng(34.052234, -118.243685);
    var lngSpan = northEast.lng() - southWest.lng();
    var latSpan = northEast.lat() - southWest.lat();

    // set multiple marker
    var i = 0;
    for (i in marker_these_users) {
        // init markers
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(marker_these_users[i].geocoords.lat, marker_these_users[i].geocoords.lng),
            map: map,
            title: 'Click Me '
        });

        // process multiple info windows
        (function(marker, i) {
            // add click event
            google.maps.event.addListener(marker, 'click', function() {
                $window.infowindow = new google.maps.InfoWindow({
                    content: 'Hello, World!!'
                });
                infowindow.open(map, marker);
            });
        })(marker, i);
    }

  }
   
          





$scope.getMyLocationbtn = function(){
  console.log("clicked on getmylocation btn")
  // show spinner while getlocation() does its thing
  $('.result').html('<i class="fa fa-spinner fa-spin"></i>');
  getLocation();
};


  // Google Returns local businesses and stuff


  // Sockets sends location of user
  $scope.sendSocket = function(username, geocoords){
    socket.emit('newconnection',{message: "a new user has connected", username: username, geocoords: geocoords });
  }
  
  $scope.sendmessage = function(texttosend){
    var themessage = {text: texttosend, inCity: $scope.inCity, username: $scope.login.username, timestamp: Date.now()};
    console.log("themessage", themessage)
    socket.emit('chatmessage', themessage )
  }



  // sockets returns the last seen location of other users
  
  socket.on('message', function(message){
    console.log("socket - message: ", message)
      $scope.$apply(function () {
          $scope.messages.push(message)
      });
    
  });

  $window.seeMessages = function(){
    console.log($scope.messages)
  }

  socket.on('data', function(data){
    console.log("socket - data: ", data)
    if (data.event == "locationupdated"){
      $scope.inCity = data.inCity;

      $scope.$apply(function () {
            $scope.nolocation = !$scope.nolocation
            $scope.plotusers(data.urLatLng.lat,data.urLatLng.lng, data)
      });
      console.log("location has been updated")
    }
    
  });

  $scope.addtoarray = function(){
    $scope.messages.push($scope.trythis)
  }

  


    
  }
export default ConsoleController;
