
  function ConsoleController($scope,$http, $resource, $auth, $state) {
    console.log('Main controller Angular');

    $scope.pointingtous  = false;
    $scope.authenticated = false;

    $scope.login = {email: "",password: "", username: ""}


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
    })
   }

  $scope.submitRegister = function(){
    console.log("email: ", $scope.login.email, "password: ", $scope.login.password);
    $auth.signup($scope.login).then(function(response){
       console.log(response);
       $scope.authenticated = true;
       $state.go('dashboard')
    })
  }

  $scope.logout = function(){
    console.log("email: ", $scope.login.email, "password: ", $scope.login.password);
    $auth.logout()
    $scope.authenticated = false;
    $state.go('login')
  }
  
    
  }
export default ConsoleController;
