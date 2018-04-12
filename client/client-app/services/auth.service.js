(function () {
    'use strict';

    angular.module('app')
        .factory('authService', ['$http', '$rootScope', '$q', '$localStorage', authService])

    function authService($http, $rootScope, $q, $localStorage) {
        return {
            authenticate: authenticate,
            isAuthenticated: isAuthenticated,
            clearCredentials: clearCredentials
        };

        function authenticate(url, credentials) {
            var deferred = $q.defer();
            http.post(url, credentials)
                .then(function setCredentials(response) {
                    deferred.resolve(response);
                },

                    function errorCallback(response) {
                        deferred.reject(response);
                    })

            return deferred.promise;
        };

        function setCredentials(response) {
            $rootScope.storage = response.token;
            $http.defaults.headers.common['x-auth'] = response.token;
            $rootScope.storage.token = response.token;
            $rootScope.storage.roles = response.roles;
        };

        function isAuthenticated() {
            return !($rootScope.storage.token === undefined);
        };

        function hasPermission(role){

            if(!$rootScope.storage.roles) return false;
            $rootScope.storage.roles.forEach(function(userRole){
                return userRole === role ? true : false;
            })
        };
    
        function clearCredentials() {
            $rootScope.token = undefined;
            $http.defaults.headers['x-auth'] = undefined; 
        };
    
    }

    
})()