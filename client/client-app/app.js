(function(){
    'use strict';

    const app = angular.module('app', ['ui.router', 'ngStorage'])

    app.run(['$rootScope', '$transitions', '$state', '$localStorage', '$http', 'authService', 
    function($rootScope, $transitions, $state, $localStorage, $http, authService){
        $rootScope.storage = $localStorage;
        $http.defaults.headers.common['x-auth'] = $rootScope.storage.token;
        $transitions.onStart({
            to : function(state){
                return state.data != null && state.data.authRequired === true
            }, function(){
                if(!authService.isAuthenticated()){
                    return $state.target("landing");
                }
                if(!authService.hasPermission($state.data.role)){
                    return $state.target("access-denied")
                }
            }
        })
    }])
})();