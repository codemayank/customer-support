(function(){
    'use strict';
    angular.module('app')
        .component('userDashboard', {
            templateUrl : './client-app/templates/userdashboard.component.html',
            controller : function($location, authService, Notification){
                var vm = this;
                vm.dashboard = 'Welcome to user dash board.';
                vm.username = window.localStorage.username
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