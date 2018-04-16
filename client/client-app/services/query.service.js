(function () {
    'use strict';
    angular.module('app')
        .factory('queryService', ['$http', '$q', 'storageService', queryService])

    function queryService($http, $q, storageService) {
        return {
            getQueryList: getQueryList,
            getQuery: getQuery,
            submitData: submitData,
            deleteQuery : deleteQuery
        }

        function getQueryList() {
            console.log('firing get query list')
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'query/user/show-queries',
                headers: {
                    'x-auth': window.localStorage.authToken,
                    'x-userType': window.localStorage.userRole === 'adminAuth' ? 'Admin' : 'User'
                }
            }).then(function (response) {
                console.log(response);
                deferred.resolve(response);
            }).catch(function (error) {
                deferred.reject(error);
            })
            return deferred.promise;
        }

        function submitData(url, method, Data) {
            console.log('submit data function fired.');
            var deferred = $q.defer();
            $http({
                method: method,
                url: url,
                data: Data || null,
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

        function getQuery(query_id) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: '/query/user/' + query_id,
                headers: {
                    'x-auth': window.localStorage.authToken,
                    'x-userType': window.localStorage.userRole === 'adminAuth' ? 'Admin' : 'User'
                }
            }).then(function (response) {
                deferred.resolve(response);
                storageService.store(response.data.ticket);

            }).catch(function (error) {
                deferred.reject(error)
            })
            return deferred.promise;
        }

        function deleteQuery(input){
            console.log(input);
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: '/query/user/delete-query/' + input,
                headers:{
                    'x-auth': window.localStorage.authToken,
                    'x-userType': window.localStorage.userRole === 'adminAuth' ? 'Admin' : 'User'
                }
            }).then(function(response){
                deferred.resolve(response);
            }).catch(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        }

        function markResolved(input){
            console.log(input);
            var deferred
        }
    }
})();