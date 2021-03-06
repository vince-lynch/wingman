
  function ConsoleController($scope,$http, $resource, $auth, $state, $window, Upload) {
    console.log('Main controller Angular');

    $scope.pointingtous  = false;
    $scope.authenticated = false;
    $scope.nolocation = true;
    $scope.messages = [{username: "app", message: "Loading..", timestamp: Date.now() }];
    $window.messages = [];
    $scope.inCity = "";
    $scope.texttosend = "";
    $scope.userList = [];
    $scope.nightclubs = [];
    $scope.bars = [];
    $scope.geocoords = {};
    $scope.showCheckin = false;
    
   
    $scope.login = {email: "",password: "", username: ""}

   $scope.$watch('inCity', function() {
     $scope.getMessageHistory()
   });
   
   $scope.$watch('nightclubs', function() {
    var i = 0;
    for (i in $scope.nightclubs){
        var theirLocation = new google.maps.LatLng($scope.geocoords.lat, $scope.geocoords.lng);
        var venueLocation = new google.maps.LatLng($scope.nightclubs[i].geometry.location.lat, $scope.nightclubs[i].geometry.location.lng);
        $scope.nightclubs[i].distance = (google.maps.geometry.spherical.computeDistanceBetween(theirLocation, venueLocation) / 1000).toFixed(2);
        $scope.nightclubs[i].checkedIn =  $scope.nightclubs[i].checkedIn == undefined ? false :  $scope.nightclubs[i].checkedIn;
       }
    });

    $scope.$watch('bars', function() {
      var i = 0;
      for (i in $scope.bars){
        //console.log("reached bars.$watch:", $scope.bars[i])
        var theirLocation = new google.maps.LatLng($scope.geocoords.lat, $scope.geocoords.lng);
        var venueLocation = new google.maps.LatLng($scope.bars[i].geometry.location.lat, $scope.bars[i].geometry.location.lng);
        $scope.bars[i].distance = (google.maps.geometry.spherical.computeDistanceBetween(theirLocation, venueLocation) / 1000).toFixed(2);
        $scope.bars[i].checkedIn =  $scope.bars[i].checkedIn == undefined ? false :  $scope.bars[i].checkedIn;
       }
    });

    var socket = window.io();

    $scope.usersPageInit = function(){

     $http({
       method: 'POST',
       url: '/api/users',
       data: { city: $scope.inCity }
      }).then(function(response){
         console.log(response)
         $scope.userList = response.data;
      });

    }

   $scope.getMessageHistory = function(){
    console.log("getMessageHistory() called")
     $http({
       method: 'POST',
       url: '/api/messages/history',
       data: { city: $scope.inCity }
      }).then(function(response){
         console.log(response)
         $scope.messageHistory = response.data;
      });
  }


    


    console.log("controller loaded");

    $scope.submit = function(file){ //function to call on form submit
      console.log("submit function called, file: ", file)
        if (file) { //check if from is valid
            $scope.upload(file); //call upload function
        }
    }
    $scope.upload = function (file) {
        Upload.upload({
            url: '/api/upload', //webAPI exposed to upload the file
            data:{file:file, login: $scope.login} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                $window.resp = resp;
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
            $window.resp = resp.res
        }, function (evt) { 
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };



 /*  $scope.isAuth = function(){
      $scope.authenticated ? '' : $state.go('login');
   }*/

   $window.state = $state;

   $scope.isAuth = function() {
    $scope.isAuthenticated = $auth.isAuthenticated()

    if($scope.isAuthenticated){
      $scope.payload = $auth.getPayload();

      if($state.current.name == "login"){
        $state.go('dashboard')
      }

      console.log("payload", $scope.payload)

      $scope.login.profilepicture = $scope.payload._doc.image;
      $scope.login.usertype       = $scope.payload._doc.type;
      $scope.login.username       = $scope.payload._doc.username;
      $scope.login.lastLatLng     = $scope.payload._doc.lastLatLng
    } else {
      $state.go('login') // go back to login page
    }
  };

  $scope.logout = function(){
    $auth.logout();
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
      $scope.login.profilepicture = response.data.user.image
      console.log("$scope.login", $scope.login)
 
      $state.go('dashboard')
      $scope.sendSocket($scope.login.username);
    }).catch(function(err){
       $scope.authMessage = 'not authenticated, please either register, or recover your password?';
     })
   }

  $scope.submitRegister = function(){
    console.log("email: ", $scope.login.email, "password: ", $scope.login.password);
    $auth.signup($scope.login).then(function(response){
       console.log(response);
  
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

    console.log("browser supports geolocation, going to call requestLocation() function")

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


      var geocoords = {lng: pos.coords.longitude, lat: pos.coords.latitude} //{lat:  "51.4937728", lng: "-0.1422" }//
      $scope.geocoords = geocoords;

      // needs to calculate nearest city using GOOGLE. (in order to create rooms/ something like that with sockets)
      //$http.post('', geocoords, config).then(successCallback, errorCallback);

       console.log("geocoords are: ", geocoords)
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

    var marker_these_users = data.lastLogs;

    //marker_these_users.push({username: $scope.login.username, timestamp: Date.now(), geocoords: {lat: lat, lng: lng}})
    
    var i = 0;
/*    for (i in data.lastLogs){
      if (data.lastLogs[i].username !=  $scope.login.username){
         marker_these_users.push(data.lastLogs[i])
      }
    }*/
    console.log("going to add these users to the map", marker_these_users)
    $window.marker_these_users = marker_these_users;


     // map options
    var options = {
        zoom: 13,
        center: new google.maps.LatLng(lat, lng), // centered on logged in user location
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        mapTypeControl: false
    };

    // init map
    var map = new google.maps.Map(document.getElementById('map-result'), options);


    // set multiple marker
    var i = 0;
    for (i in marker_these_users) {

      console.log("printing i: ", i, "username: ", marker_these_users[i].username, "to the map")
        // init markers
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(marker_these_users[i].lastLatLng.lat, marker_these_users[i].lastLatLng.lng),
            map: map,
            clickable: true
        });

        //var marker = new google.maps.Marker({map: map, position: point, clickable: true});

        marker.info = new google.maps.InfoWindow({
          content: '<b>username:</b> ' + marker_these_users[i].username + ' last online: ' + marker_these_users[i].lastUpdate
        });

        google.maps.event.addListener(marker, 'click', function() {
          var marker_map = this.getMap();
          this.info.open(marker_map);
        });

        // // process multiple info windows
        // (function(marker, i) {
        //     // add click event
        //     google.maps.event.addListener(marker, 'click', function() {
        //         $window.infowindow = new google.maps.InfoWindow({
        //             content: 'Hello, World!!'
        //         });
        //         infowindow.open(map, marker);
        //     });
        // })(marker, i);
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
    var themessage = {text: texttosend, inCity: $scope.inCity, username: $scope.login.username, timestamp: Date.now(), avatar: $scope.login.profilepicture};
    console.log("themessage", themessage)
    
  }


  $scope.checkIn = function(venueObj, InOut){

     var message = InOut == "in" ? "has just checked in to " + venueObj.name +" ... " : "has just left" + venueObj.name +" ... "
     
     venueObj = InOut == 'in' ? venueObj : {}; // empty venueObj object if checking out.

     //update frontend user object with venue information
     $scope.login.checkedIn = InOut == 'in' ? venueObj : {};

     socket.emit('checkin', {text: message, inCity: $scope.inCity, username: $scope.login.username, avatar: $scope.login.profilepicture, venue: venueObj} )

     var i = 0;
     for (i in $scope.bars){
      if($scope.bars[i].id == venueObj.id){
        $scope.bars[i].checkedIn = InOut == "in" ? true : false;
      }
     }

     var i = 0;
     for (i in $scope.nightclubs){
      if($scope.nightclubs[i].id == venueObj.id){
        $scope.nightclubs[i].checkedIn = InOut == "in" ? true : false;
      }
     }
     //venueObj.checkedIn = {status: true, timestamp: Date.now()}
     console.log($scope.nightclubs)
     console.log($scope.bars)
     $scope.$apply(function () {
        $scope.showCheckin = false;
     });
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
            $scope.nightclubs = data.places_results.nightclubs.results
            $scope.bars = data.places_results.bars.results
            $scope.plotusers(data.urLatLng.lat,data.urLatLng.lng, data)
            $scope.login.checkedIn = data.userObj[0].venueCheckedIN;
      });
      console.log("location has been updated")
    }
    
  });

  $scope.addtoarray = function(){
    $scope.messages.push($scope.trythis)
  }

  


    
  }
export default ConsoleController;
