(function () {
    'use strict';
    angular.module('app')
        .component('userLogin', {
            templateUrl: './client-app/templates/userlogin.component.html',
            controller: function ($location, authService) {
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
                                
                        }, function(_error){
                            console.log(_error);
                            alert("Login Error" + (_error.message ? _error.message : _error.data.error))
                        })
                }
            }
        })

})();