(function() {
    'use strict';
    angular.module('app')
      .factory('authService', ['$http', '$q', '$timeout', authService])
  
    function authService($http, $q, $timeout) {
      var user = null;
  
      return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        login: login,
        logout: logout,
        register: register
      });
  
      function isLoggedIn() {
        if (user) {
          console.log(user);
          return true;
        } else {
          return false;
        }
      }
  
      function getUserStatus() {
        return $http({
            method : 'GET',
            url : '/user/status',
            headers : {
                'x-auth' : window.localStorage.authToken
            }
        })
          .then(function successCallback(response) {
              if (response.data.status === 200) {
                console.log('getting user status');
                user = true;
              } 
            },
            function errorCallback(response) {
              user = false;
  
            })
      }
  
      function login(type, credentials) {
        var deferred = $q.defer();
        var url = '/user/user-login'
        if(type === 'admin'){
            url = '/user/admin-login';
        }
        $http.post(url, credentials)
          .then(function successCallback(response) {
              if (response.status === 200) {
                console.log(response.data);
                user = true;
                window.localStorage.authToken = response.headers()['x-auth'];
                window.localStorage.username = response.data.username;
                window.localStorage.userRole = response.data.roles[0];
                deferred.resolve(response);
              }
            },
            function errorCallback(response) {
              user = false;
              deferred.reject(response);
            })
        return deferred.promise;
      }
  
      function logout() {
  
        var deferred = $q.defer();
        var token = window.localStorage['authToken'] || 'empty';
        console.log(token);
        $http({
          method : 'POST',
          url : '/user/user-logout',
          headers : {
            'x-auth' : token
          } 
        })
          .then(function successCallback(response) {
              user = false;
              deferred.resolve();
              console.log('successfully logged out.');
            },
            function errorCallback(response) {
              user = false;
              deferred.reject()
            })
        return deferred.promise;
      }
  
      function register(username, password, email) {
        var deferred = $q.defer();
        $http.post('/register', {
            username: username,
            password: password,
            email: email
          })
          .then(function successCallback(response) {
              if (response.status === 200 && response.data.status) {
                user = true;
                console.log('login successfull');
                deferred.resolve(response);
              } else {
                user = false;
                deferred.reject(response);
              }
            },
            function errorCallback(response) {
              user = false;
              console.log(response);
              deferred.reject(response);
            })
        return deferred.promise;
      }
    }
  })();