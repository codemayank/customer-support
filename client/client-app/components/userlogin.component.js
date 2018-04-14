(function () {
    'use strict';
    angular.module('app')
        .component('userLogin', {
            templateUrl: './client-app/templates/userlogin.component.html',
            controller: function ($location, authService, Notification) {
                var vm = this;

                vm.login = function () {
                    let credentials = {
                        username: vm.loginForm.username,
                        password: vm.loginForm.password,
                    }
                    authService.login('user', credentials)
                        .then(function (response) {
                            $location.path('/user/dashboard');
                            vm.loginForm = {};
                            var welcomeMessage = "welcome " + response.data.username;
                            Notification.success(welcomeMessage);
                                
                        }, function(_error){
                            console.log(_error);
                            Notification.error('Incorrect username or password.')
                        })
                }
            }
        })

})();