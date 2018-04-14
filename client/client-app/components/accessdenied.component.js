(function(){
    'use strict';
    angular.module('app')
        .component('accessDenied', {
            templateUrl : './client-app/templates/accessdenied.component.html',
            controller : function (){
                let vm = this;
                vm.accessDeniedData = "this is the access denied data."
            }
    })
})();