angular
    .module('anOutlandishWebApp')
    .factory('User', function($rootScope, $http) {
        "use strict";

        var methods = {},
            _user = null;

        methods.authenticate = function(email, password, done) {
            $http.post('/auth/local/signin', {
                email: email,
                password: password
            }).then(function(res) {
                methods.load(done);
            }, function(err) {
                done(err);
            })
        };

        methods.create = function(email, password, done) {
            $http.post('/auth/local/signup', {
                email: email,
                password: password
            }).then(function(res) {
                done();
            }, function(err) {
                done(err);
            });
        };

        methods.load = function(done) {
            $http.get('/api/user').then(function(res) {
                _user = res.data;
                $rootScope.user = res.data;
                done(null, _user);
            }, function(err) {
                done(err);
            });
        };

        methods.get = function() {
            return _user;
        };

        return methods;
    });