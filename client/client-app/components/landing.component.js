(function(){
    'use strict';

    angular.module('app')
        .component('landing', {
            bindings : {hello : '<'},
            templateUrl : './client-app/templates/landing.component.html',
            controller : function landingController(){
                let vm = this;
                vm.welcomeMessage = 'Welcome to the customer support app.'
                console.log(vm.hello);
            }
        })
})()