(function(){
    'use strict';

    angular.module('app')
        .component('landing', {
            css : './client-app/templates/styles/landingpage.css',
            templateUrl : './client-app/templates/landing.component.html',
            controller : function landingController(){
                let vm = this;
                vm.welcomeMessage = 'Welcome to the customer support app.'
            }
        })
})()