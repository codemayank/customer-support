(function () {
    'use strict';
    angular.module('app')
        .component('adminRegister', {
            templateUrl: './client-app/templates/adminregister.component.html',
            controller: function ($state, authService) {
                var vm = this;

                vm.register = function () {
                    var url = '/user/admin-registration';
                    let credentials = {
                        username: vm.registerForm.username,
                        email: vm.registerForm.email,
                        password: vm.registerForm.password,
                        phoneNumber: vm.registerForm.phoneNumber,
                        admin_id : vm.registerForm.admin_id

                    }
                    authService.authenticate(url, credentials)
                        .then(function (response) {
                            console.log(response);
                            $state.go('adminDashboard');
                        })
                        .catch(function (response) {
                            console.log(response)
                        })
                }
            }
        })
})();