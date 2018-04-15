(function () {
    'use strict';
    angular.module('app')
        .component('userDashboard', {
            templateUrl: './client-app/templates/userdashboard.component.html',
            controller: function ($http, $location, authService, Notification, queryService) {
                var vm = this;
                //transfer this to a service.
                vm.$onInit = function () {
                    queryService.getQueryList()
                        .then(function(response){
                            vm.ticket = response.data
                        }).catch(function(error){
                            console.log(error)
                        })
                }

                vm.checkResolved = function (resolved) {
                    console.log(resolved)
                    if (resolved) {
                        console.log(resolved)
                        return 'badge badge-success badge-pill'
                    } else {
                        return 'badge badge-danger badge-pill'
                    }
                }
                vm.dashboard = 'Welcome to user dash board.';
                vm.username = window.localStorage.username

                vm.logout = function () {
                    authService.logout()
                        .then(function () {
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
        .component('createTicket', {
            templateUrl: './client-app/templates/createticket.component.html',
            controller: function ($q, $http, $location, queryService) {
                let vm = this;
                vm.submitTicket = function () {
                    var url = '/query/user/submit-query';
                    var ticket = {
                        qTitle: vm.queryForm.qTitle,
                        qDescription: vm.queryForm.qDescription
                    }
                    queryService.submitData(url, ticket).then(function (response) {
                        console.log(response);
                        $location.path('/user/dashboard')
                    }).catch(function (error) {
                        console.log(error);
                    })

                }
            }
        })
        .component('queryDetail', {
            css : './client-app/templates/styles/user-detail.css',
            templateUrl: './client-app/templates/query-detail.component.html',
            controller: function ($location, $http, $q, $routeParams, queryService) {
                var vm = this;
                vm.textLimit = 100;
                vm.$onInit = function () {
                    $http({
                        method: 'GET',
                        url: '/query/user/' + $routeParams.query_id,
                        headers: {
                            'x-auth': window.localStorage.authToken,
                            'x-userType': window.localStorage.userRole === 'adminAuth' ? 'Admin' : 'User'
                        }
                    }).then(function (response) {
                        vm.ticket = response.data.ticket;
                        console.log(vm.ticket);
                    }).catch(function (error) {
                        console.log(error);
                    })
                }
                vm.submitMessage = function(){
                    var url = '/query/user/submit-reply';
                    var message = {
                        ticket_id : vm.ticket._id,
                        message : {
                            messageBody : vm.messageForm.messageBody
                        }
                    }
                    queryService.submitData(url, message).then(function (response) {
                        console.log(response);
                        $location.path('/user/dashboard')
                    }).catch(function (error) {
                        console.log(error);
                    })


                }

            }

        })
})();