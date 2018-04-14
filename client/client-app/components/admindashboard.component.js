(function(){
    'use strict';
    angular.module('app')
        .component('adminDashboard', {
            templateUrl : './client-app/templates/admindashboard.component.html',
            controller : function($location, authService, Notification){
                var vm = this;
                vm.welcomMessage = "Welcome to the admin Dashboard component.";
                vm.username = window.localStorage.username;
                vm.logout = function() {
                    authService.logout()
                      .then(function() {
                        if (vm.username) {
                        console.log('removing user data');
                         window.localStorage.removeItem("x-auth");
                         window.localStorage.removeItem("username");
                         window.localStorage.removeItem('role');
                        }
                        $location.path('/');
                      });
                  }
            }
    })
})();