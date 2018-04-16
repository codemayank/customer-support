(function(){
    'use strict;'
    angular.module('app')
        .factory('storageService', [storageService])

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