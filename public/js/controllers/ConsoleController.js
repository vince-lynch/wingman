
  function ConsoleController($scope,$http, $resource, $auth, $state, $window) {
    console.log('Main controller Angular');

    $scope.pointingtous  = false;
    $scope.authenticated = false;

    $scope.login = {email: "",password: "", username: ""}

    var socket = window.io();


    console.log("controller loaded");


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

  /** 
  first, test for feature support
  **/
  if('geolocation' in window.navigator){
    // geolocation is supported :)
    requestLocation();
  }else{
    // no geolocation :(
    msg = "Sorry, looks like your browser doesn't support geolocation";
    outputResult(msg); // output error message
    $('.pure-button').removeClass('pure-button-primary').addClass('pure-button-success'); // change button style
  }

  /*** 
  requestLocation() returns a message, either the users coordinates, or an error message
  **/
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

      var geocoords = {lng: pos.coords.longitude, lat: pos.coords.latitude}

      // send back their location to the server (via sockets)
      $scope.sendSocket($scope.login.username, geocoords)
      // and presto, we have the device's location!
      msg = 'You appear to be at longitude: ' +  geocoords.lng + ' and latitude: ' +  geocoords.lat  + '<img src="http://maps.googleapis.com/maps/api/staticmap?zoom=15&size=300x300&maptype=roadmap&markers=color:red%7Clabel:A%7C' + geocoords.lat + ',' + geocoords.lng+ '&sensor=false">';
      outputResult(msg); // output message
      $('.pure-button').removeClass('pure-button-primary').addClass('pure-button-success'); // change button style
    }
  
    // upon error, do this
    function error(err){
      // return the error message
      msg = 'Error: ' + err + ' :(';
      outputResult(msg); // output button
      $('.pure-button').removeClass('pure-button-primary').addClass('pure-button-error'); // change button style
    }  
  } // end requestLocation();

  /*** 
  outputResult() inserts msg into the DOM  
  **/
  function outputResult(msg){
    $('.result').addClass('result').html(msg);
  }
} // end getLocation()



$scope.getMyLocationbtn = function(){
  console.log("clicked on getmylocation btn")
  // show spinner while getlocation() does its thing
  $('.result').html('<i class="fa fa-spinner fa-spin"></i>');
  getLocation();
};


  // Google Returns local businesses and stuff


  // Sockets sends location of user
  $scope.sendSocket = function(username, geocoords){
    socket.emit('message',{message: "this is a message", username: username, geocoords: geocoords });
  }
  



  // sockets returns the last seen location of other users
  
  socket.on('message', function(message){
    console.log("socket - message: ", message)
  });


    
  }
export default ConsoleController;
