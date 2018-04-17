(function(){
    'use strict';

    const app = angular.module('app', ['ngRoute', 'ngStorage', 'ui-notification', 'angularCSS', 'angular-loading-bar', 'ngAnimate', 'angularMoment']);

    app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider){
        //TODO: Remove the below line if not required.
        // cfpLoadingBarProvider.spinnerTemplate = '<div class="ui segment"><div class="ui active dimmer"><div class="ui massive text loader">Loading</div></div></div>'
    }])

})();