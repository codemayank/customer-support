(function(){
    'use strict';
    angular.module('app')
        .component('userRegister', {
            templateUrl : './client-app/templates/userregister.component.html',
            controller : function($state, authService){
                var vm = this;
                
                vm.register = function(){
                    var url = '/user/user-registration';
                    let credentials = {
                        username : vm.registerForm.username,
                        email : vm.registerForm.email,
                        password : vm.registerForm.password,
                        phoneNumber : vm.registerForm.phoneNumber

                    }
                    authService.authenticate(url, credentials)
                        .then(function(response){
                            console.log(response);
                            $state.go('userDashboard');
                        })
                        .catch(function(response){
                            console.log(response)
                        })
                }
            }
    })
})();