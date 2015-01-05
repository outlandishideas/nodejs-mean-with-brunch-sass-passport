angular
    .module('anOutlandishWebApp')
    .controller('WelcomeController', function($scope, $rootScope) {
        "use strict";

        $rootScope.className = 'welcome';
        $rootScope.title = 'Welcome!';
        
        $scope.welcomeText = 'Welcome, ' + $rootScope.user.email;
    });