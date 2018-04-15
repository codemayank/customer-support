(function(){
    'use strict';
    angular.module('app')
        .factory('queryService', ['$http', '$q', queryService])

        function queryService($http, $q){
            return{
                getQueryList : getQueryList,
                getQuery : getQuery,
                submitData : submitData,
            }

            function getQueryList(){
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: 'query/user/show-queries',
                    headers: {
                        'x-auth': window.localStorage.authToken,
                        'x-userType': window.localStorage.userRole === 'adminAuth' ? 'Admin' : 'User'
                    }
                }).then(function (response) {
                    deferred.resolve(response);
                }).catch(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            }

            function submitData(url, Data) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: url,
                    data: Data,
                    headers: {
                        'x-auth': window.localStorage.authToken,
                        'x-userType': window.localStorage.userRole === 'adminAuth' ? 'Admin' : 'User'
                    }
                }).then(function (response) {
                    deferred.resolve(response);
                }).catch(function (error) {
                    console.log(error);
                    deferred.reject(error);
                })
                return deferred.promise;
            }
        }
})();