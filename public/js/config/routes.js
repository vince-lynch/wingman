export default function ($stateProvider, $urlRouterProvider) {
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
  }