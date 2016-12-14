import ConsoleController from './controllers/ConsoleController';
//import oAuthKeys from './services/oAuthKeys';
//import ProductService from './services/ProductService';

var app = angular.module('liveguardManager', ['ngResource', 'satellizer', 'angular-jwt', 'ui.router'])
  .constant('API', '/manager/api') 
  //.config(InterceptorConfig)
  .constant('FACEBOOK_API_KEY','1204326232924507')
  .constant('GITHUB_API_KEY','a5535bb7733d3407aa61')
  .constant('INSTAGRAM_API_KEY','41f2c793a00e49a3872e9cb67ec5b486')
  .constant('GEOCODER_API_KEY', 'AIzaSyCYiJr6lKqf9srvNfxpAk9aPZ4D0l1Hofo')
  .constant('GUARDIAN_API_KEY', '8fde4c0a-dfe1-4ff1-95cc-11cd52bcd1ff')
  .controller('consoleController', ConsoleController)
  .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
             .state('home', {
                url: '/',
                templateUrl: 'views/login.html'
            })
             .state('about', {
                url: '/about',
                templateUrl: 'views/about.html'
            });
  }).config(function ($authProvider, FACEBOOK_API_KEY){
      $authProvider
        .facebook({
          url: '/auth/facebook', // this is the place we are telling Satilette to tell facebook to send back its post request to.
          clientId: FACEBOOK_API_KEY
        })
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