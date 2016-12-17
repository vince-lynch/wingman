import ConsoleController from './controllers/ConsoleController';
//import oAuthKeys from './services/oAuthKeys';
//import ProductService from './services/ProductService';

var app = angular.module('liveguardManager', ['ngResource', 'satellizer', 'angular-jwt', 'ui.router', 'angularMoment', 'ngFileUpload'])
  .constant('API', '/manager/api') 
  //.config(InterceptorConfig)
  .constant('FACEBOOK_API_KEY','1204326232924507')
  .controller('consoleController', ConsoleController)
  .directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
    }])
  .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
             .state('home', {
                url: '/',
                templateUrl: 'views/login.html'
            })
             .state('login', {
                url: '/login',
                templateUrl: 'views/login.html'
            })
             .state('profile', {
                url: '/profile',
                templateUrl: 'views/profile.html'
            })
             .state('about', {
                url: '/about',
                templateUrl: 'views/about.html'
            })
             .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'views/dashboard.html'
            });
  }).config(function ($authProvider,$urlRouterProvider, FACEBOOK_API_KEY){
      $authProvider
        .facebook({
          url: 'api/auth/facebook', // this is the place we are telling Satilette to tell facebook to send back its post request to.
          clientId: FACEBOOK_API_KEY
        });

        $urlRouterProvider.otherwise('login');

        $authProvider.loginUrl  = 'api/auth/login';
        $authProvider.signupUrl = 'api/auth/register';

        //.httpInterceptor = function(config) {
       //   return !!config.url.match(API_URL2);
      //};

    //$authProvider.tokenPrefix = null;

});




/*InterceptorConfig.$inject = ['$httpProvider'];
function InterceptorConfig($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptor');
}  ;*/

/*Router.$inject = ['$stateProvider', '$urlRouterProvider'];
function Router($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home', {
    url: '/', 
    templateUrl: 'views/console.html'
  })
  .state('about', {
    url: '/about', 
    templateUrl: 'views/about.html'
  });
  $urlRouterProvider.otherwise('/');
}*/