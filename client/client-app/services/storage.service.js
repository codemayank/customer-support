(function(){
    'use strict;'
    angular.module('app')
        .factory('storageService', [storageService])

        //storage service is used to use data across components.
        function storageService(){
            var storageService = {};
            var storage = {};

            storageService.store = function(object){
                this.storage = object;
            }

            storageService.getStore = function(){
                return this.storage;
            }

            return storageService;


        }
})()