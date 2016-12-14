
  function ConsoleController($scope,$http, $resource) {
    console.log('Main controller Angular');

    $scope.pointingtous = false;

    $scope.login = {email: "",password: ""}


    console.log("controller loaded");


    $scope.helloworld = "hello world from $scope now its not even doing it";


   $scope.submitLogin = function(){
    console.log("email: ", $scope.login.email, "password: ", $scope.login.password);
   }
    
  }
export default ConsoleController;
console.log("I really have just changed this file")