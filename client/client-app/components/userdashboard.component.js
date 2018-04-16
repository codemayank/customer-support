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
                            vm.queryList = response.data.tickets
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
            templateUrl : './client-app/templates/ticket.component.html',
            controller: function ($q, $http, $location, queryService) {
                let vm = this;
                vm.edit = false;

                vm.submitTicket = function () {
                    var url = '/query/user/submit-query';                
                    console.log('submit ticket event fired.');
                    var ticket = {
                        qTitle: vm.queryForm.qTitle,
                        qDescription: vm.queryForm.qDescription
                    }
                    queryService.submitData(url, 'POST', ticket).then(function (response) {
                        console.log(response);
                        $location.path('/user/dashboard');
                        vm.queryForm = {};
                    }).catch(function (error) {
                        console.log(error);
                        vm.queryForm = {};
                    })

                }
            }
        })
        .component('editQuery', {
            templateUrl : './client-app/templates/ticket.component.html',
            controller : function($q, $http, $location, queryService, storageService){
                let vm = this;
                var query = storageService.storage;
                vm.edit = true;
                if(query){
                    vm.queryForm = {
                        qTitle : query.qTitle,
                        qDescription : query.qDescription
                    }    
                }
                vm.submitTicket = function(){
                    var url = 'query/user/edit-query';
                    var ticket = {
                        ticket_id : query._id, 
                        qTitle : vm.queryForm.qTitle,
                        qDescription : vm.queryForm.qDescription
                    }
                    queryService.submitData(url, 'PUT', ticket).then(function(response){
                        console.log(response);
                        $location.path('/user/show/' + response.data._id);
                        vm.queryForm = {};
                    }).catch(function(error){
                        console.log(error);
                        vm.queryForm = {};
                    })   
                }

                vm.deleteTicket = function(){
                    console.log(query);
                    var url = '/query/user/delete-query/' + query_id;
                    queryService.submitData(url, 'DELETE', null)
                        .then(function(response){
                            console.log(response);
                            $location.path('/user/dashboard');
                        }).catch(function(error){
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
                    console.log($routeParams);
                    queryService.getQuery($routeParams.query_id)
                        .then(function(response){
                            console.log(response.data);
                            vm.ticket = response.data.ticket;
                        }).catch(function(error){
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

                vm.markResolved = function(){
                    var url = '/query/user/mark-resolved/' + vm.ticket._id;
                    queryService.submitData(url, 'PUT').then(function(response){
                        console.log(response);
                    }).catch(function(response){
                        console.log(error);
                    })
                }
            }

        })

})();