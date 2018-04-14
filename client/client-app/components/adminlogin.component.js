(function () {
    'use strict';
    angular.module('app')
        .component('adminLogin', {
            templateUrl: './client-app/templates/adminlogin.component.html',
            controller: function ($location, authService, Notification) {
                var vm = this;

                vm.login = function () {
                    let credentials = {
                        admin_id: vm.loginForm.admin_id,
                        password: vm.loginForm.password,
                    }
                    authService.login('admin', credentials)
                        .then(function (response) {
                            $location.path('/admin/dashboard');
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