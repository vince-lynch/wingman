export default function ($authProvider,$urlRouterProvider, FACEBOOK_API_KEY){
      $authProvider
        .facebook({
          url: 'api/auth/facebook', // this is the place we are telling Satilette to tell facebook to send back its post request to.
          clientId: FACEBOOK_API_KEY
        });

        $urlRouterProvider.otherwise('login');

        $authProvider.loginUrl  = 'api/auth/login';
        $authProvider.signupUrl = 'api/auth/register';


}