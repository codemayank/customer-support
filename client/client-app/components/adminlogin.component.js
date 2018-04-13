(function(){
    'use strict';
    angular.module('app')
    .component('adminLogin', {
        templateUrl : './client-app/templates/adminlogin.component.html',
        controller: function ($state, authService) {
            var vm = this;

            vm.login = function () {
                var url = '/user/admin-login';
                let credentials = {
                    admin_id: vm.loginForm.admin_id,
                    password: vm.loginForm.password,
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