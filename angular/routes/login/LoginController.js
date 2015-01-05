angular
    .module('anOutlandishWebApp')
    .controller('LoginController', function($scope, $rootScope, $location, User) {
        "use strict";

        $rootScope.className = 'login';
        $rootScope.title = 'Login';

        $scope.signUp = function() {
            User.create($scope.email, $scope.password, function(err) {
                if(err) {
                    alert("Could not sign up. Please try again later.");
                    return;
                }

                // User created successfully. Now sign them in automatically:
                $scope.logIn();
            });
        };

        $scope.logIn = function() {
            User.authenticate($scope.email, $scope.password, function(err) {
                if(err) {
                    alert("Could not log you in. Did you enter the correct credentials?");
                    return;
                }

                // Redirect the user on successful authentication:
                $location.path('/welcome');
            });
        };
    });