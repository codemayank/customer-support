(function () {
    'use strict';
    angular.module('app')
        .component('userLogin', {
            templateUrl: './client-app/templates/userlogin.component.html',
            controller: function ($state, authService) {
                var vm = this;

                vm.login = function () {
                    var url = '/user/user-login';
                    let credentials = {
                        username: vm.loginForm.username,
                        password: vm.registerForm.password,
                    }
                    authService.authenticate(url, credentials)
                        .then(function (response) {
                            console.log(response);
                            $state.go('userDashboard');
                        })
                        .catch(function (response) {
                            console.log(response)
                        })
                }
            }
        })

})();