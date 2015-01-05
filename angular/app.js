angular
    .module('anOutlandishWebApp', ['ngRoute', 'templates'])
    .config(function($routeProvider, $locationProvider) {
        var baseUrl = 'angular/routes';

        var resolvers = {
            fetchUser: function($q, $location, User) {
                var defer = $q.defer();

                User.load(function(err) {
                    if(err) {
                        $location.path('/login');
                        return;
                    }

                    defer.resolve();
                });

                return defer.promise;
            },
            redirectWithUser: function($q, $location, User) {
                var defer = $q.defer();

                User.load(function(err, user) {
                    if(err || !user) {
                        defer.resolve();
                        return;
                    }

                    $location.path('/welcome');
                });

                return defer.promise;
            }
        };

        $routeProvider
            .when('/login', {
                templateUrl: baseUrl + '/login/login.html',
                controller: 'LoginController',
                resolve: { redirectWithUser: resolvers.redirectWithUser }
            })
            .when('/welcome', {
                templateUrl: baseUrl + '/welcome/welcome.html',
                controller: 'WelcomeController',
                authenticate: true,
                resolve: { fetchUser: resolvers.fetchUser }
            })
            .otherwise({
                redirectTo: '/login'
            });

        $locationProvider.html5Mode(true);
    });