(function () {
    'use strict';
    angular.module('app')
        .component('signIn', {
            css : './client-app/templates/styles/signinform.css',
            templateUrl: './client-app/templates/signin.component.html',
            controller: function ($location, authService, Notification, $routeParams) {
                var vm = this;
                //check the url for user type and action and set the scope variable accordingly to activate the view
                //for correct user type and action.
                vm.admin = $routeParams.userType === 'admin' ? true : false; 
                vm.action = $routeParams.action;
                vm.showLoginForm = $routeParams.action === 'login' ? true : false; 
                vm.showRegForm = $routeParams.action === 'registration' ? true : false;
                vm.forgotPassword = $routeParams.action === 'forgotpassword' ? true : false;
                vm.resetPassword = $routeParams.action === 'resetpassword' ? true : false;
                console.log(vm.forgotPassword, vm.resetPassword);

                //function to generate error notifications
                var errorAlert = function(message){
                    var re1 = /username_1/g; 
                    var re2 = /email_1/g;
                    var re3 = /phoneNumber_1/g;
                    var re4 = /password/g;
                    var re5 = /Phone Number!/g;
                    if(message.errmsg && re1.test(message.errmsg)){
                       Notification.error(`The username '${message.op.username}' already exists please register with a different username`);
                    }
                    if(message.errmsg && re2.test(message.errmsg)){
                      Notification.error(`the e-mail '${message.op.email}' is already registered.`)
                    }
                    if(message.errmsg && re3.test(message.errmsg)){
                        Notification.error(`The phone number '${message.op.phoneNumber}' is already registered.`);
                    }
                    if(message && message === 'Loginerr2'){
                        Notification.error('Incorrect password.')
                    }
                    if(message && message === 'Loginerr1'){
                        Notification.error('Incorrect Username')
                    }
                    if(message.message && re4.test(message.message)){
                        Notification.error('Password Should be of Minimum 6 characters')
                    }
                    if(message.message && re5.test(message.message)){
                        Notification.error('Phone Number should be of exact 10 Numbers.')
                    }
                }
                //authorisation function used for login, register, forgot password and reset password services.
                vm.authorisation = function () {
                    var redirectUrl = '/user/dashboard';  //set the url to which user will be taken to after successful login.
                    var url = '/user/user-login';         //set the url to be used in the request object.
                    var credentials = {};                 //create credentials object
                    var headers = null;                   //default value for the header in request object.

                    if (vm.action === 'login') { //check the action type i.e whether login register reset password or forgot password.
                        credentials = { //set the credentails.
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
                            var welcomeMessage = "Welcome" + " " +response.data.username;
                            Notification.success(welcomeMessage);
                        }).catch(function (error) {
                            errorAlert(error.data);

                        })
                }

            }
        })
})();