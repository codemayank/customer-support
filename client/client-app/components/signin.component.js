(function () {
    'use strict';
    angular.module('app')
        .component('signIn', {
            templateUrl: './client-app/templates/adminlogin.component.html',
            controller: function ($location, authService, Notification, $routeParams) {
                var vm = this;
                console.log($routeParams);
                vm.admin = $routeParams.userType === 'admin' ? true : false;
                vm.action = $routeParams.action;
                vm.showLoginForm = $routeParams.action === 'login' ? true : false; 
                vm.showRegForm = $routeParams.action === 'registration' ? true : false;
                vm.forgotPassword = $routeParams.action === 'forgotpassword' ? true : false;
                vm.resetPassword = $routeParams.action === 'resetpassword' ? true : false;
                console.log(vm.forgotPassword, vm.resetPassword);

                vm.authorisation = function () {
                    var redirectUrl = '/user/dashboard';
                    var url = '/user/user-login';
                    var credentials = {};
                    var headers = null;

                    if (vm.action === 'login') {
                        credentials = {
                            username: vm.loginForm.username,
                            password: vm.loginForm.password
                        }
                        if (vm.admin) {
                            credentials = {
                                admin_id: vm.loginForm.admin_id,
                                password: vm.loginForm.password
                            }
                            url = '/user/admin-login';
                            redirectUrl = '/admin/dashboard';

                        }
                    }

                    if (vm.action === 'registration') {
                        credentials = {
                            username: vm.registerForm.username,
                            password: vm.registerForm.password,
                            email: vm.registerForm.email,
                            phoneNumber: vm.registerForm.phoneNumber
                        }
                        url = '/user/user-registration';
                        if (vm.admin) {
                            credentials.admin_id = vm.registerForm.admin_id
                            url = '/user/admin-registration';
                            redirectUrl = '/admin/dashboard';
                        }
                    }
                    if (vm.action === 'forgotpassword') {
                        url = '/user/forgot-password';
                        credentials = {
                            email: vm.forgotPasswordForm.email
                        }
                        headers = {
                            'x-userType': 'User'
                        }
                        redirectUrl = '/signin/user/resetpassword'
                        if (vm.admin) {
                            headers = {
                                'x-userType': 'Admin'
                            }
                            redirectUrl = '/signin/admin/resetpassword'
                        }
                    }
                    if (vm.action === 'resetpassword') {
                        redirectUrl = '/'
                        url = '/user/reset-password';
                        credentials = {
                            token : vm.resetPasswordForm.token,
                            newPassword : vm.resetPasswordForm.newPassword 
                        }
                        headers = {
                            'x-userType': 'User'
                        }
                        if (vm.admin) {
                            headers = {
                                'x-userType': 'Admin'
                            }
                        }
                    }
                    authService.register(url, credentials, headers)
                        .then(function (response) {
                            $location.path(redirectUrl);
                            vm.registerForm = {};
                            var welcomeMessage = "Welcome" + response.data.username;
                        }).catch(function (error) {
                            console.log(error)
                        })
                }

            }
        })
})();