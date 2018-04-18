(function () {
  'use strict';
  angular.module('app')
    .factory('authService', ['$http', '$q', '$timeout', authService])

  function authService($http, $q, $timeout) {
    var user = null;

    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      logout: logout,
      register: register
    });

    //check if the user is logged in
    function isLoggedIn() {
      if (user) {
        console.log(user);
        return true;
      } else {
        return false;
      }
    }

    //service to get the user status from the server.
    function getUserStatus() {
      return $http({
        method: 'GET',
        url: '/user/status',
        headers: {
          'x-auth': window.localStorage.authToken,
          'x-userType': window.localStorage.userRole === 'adminAuth' ? 'Admin' : 'User'
        }
      })
        .then(function successCallback(response) {
          if (response.data.status === 200) {
            console.log('getting user status');
            user = true;
          }
        })
        .catch(function errorCallback(response) {
          console.log(response);
          user = false;
        })
    }

  
    function logout() {

      var deferred = $q.defer();
      var token = window.localStorage['authToken'] || 'empty';
      console.log(token);
      $http({
        method: 'DELETE',
        url: '/user/user-logout',
        headers: {
          'x-auth': token,
          'x-userType': window.localStorage.userRole === 'adminAuth' ? 'Admin' : 'User'
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

    //service to login and register users /admins
    function register(url, credentials, headers = null) {
      var index = 0; //specify the index to get user role from the response. 0 for userAuth and 1 for adminAuth. 
      if (credentials.admin_id) {
        index = 1; 
      }
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: url,
        data: credentials,
        headers: headers
      }).then(function (response) {
        console.log(response);
        user = true;
        if (!headers) {
          window.localStorage.authToken = response.headers()['x-auth'];
          window.localStorage.username = response.data.username;
          window.localStorage.userRole = response.data.roles[index];
        }
        deferred.resolve(response);
      }).catch(function (error) {
        user = false;
        console.log(error);
        deferred.reject(error);
      })
      return deferred.promise;
    }
  }
})();