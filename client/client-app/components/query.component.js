(function () {
    'use strict;'
    angular.module('app')
        .component('queryDetail', {
            css: './client-app/templates/styles/user-detail.css',
            templateUrl: './client-app/templates/query-detail.component.html',
            controller: function ($location, $http, $q, $routeParams, queryService) {
                var vm = this;
                vm.textLimit = 100;
                vm.admin = false;
                vm.username = window.localStorage.username;

                vm.$onInit = function () {
                    console.log($routeParams);
                    var url = '/query/user/' + $routeParams.query_id;
                    if(window.localStorage.userRole === 'adminAuth'){
                        vm.admin = true;
                        url = '/query/admin/' + $routeParams.query_id;
                    }
                    queryService.getQuery(url)
                        .then(function (response) {
                            console.log(response.data);
                            vm.ticket = response.data.ticket;
                            if(response.data.ticket.resolved){
                                vm.disableMarkResolved = true;
                            }
                            if(response.data.ticket.status === 'Closed'){
                                vm.disableCloseQuery = true;
                            }
                        }).catch(function (error) {
                            console.log(error);
                        })
                }
                vm.submitMessage = function () {
                    vm.disableSubmit = true;
                    var url = '/query/submit-message/' + vm.ticket._id;
                    var message = {};
                    if(vm.action === 'newMessage'){
                        message = { text: vm.messageForm.messageBody }
                    }
                    var method = 'POST';
                    console.log(vm.ticket._id);
                    if (vm.action === 'edit') {
                        url = '/query/edit-message/' + vm.ticket._id + '/' + vm.selectedMessage._id;
                        method = 'PUT';
                        message = {text : vm.messageEditForm.messageBody}
                        console.log(url, method);
                    }
                    queryService.submitData(url, method, message).then(function (response) {
                        console.log(response);
                        vm.ticket = response.data.ticket;
                        vm.messageForm = {}
                        vm.action === 'submit';
                        vm.disableSubmit = false;
                    }).catch(function (error) {
                        console.log(error);
                        vm.messageForm = {}
                        vm.disableSubmit = false;
                    })
                }

                vm.selectMessage = function (selectedMessage) {
                    vm.messageEditForm = {};
                    console.log(selectedMessage);
                    vm.selectedMessage = selectedMessage;
                    vm.messageEditForm.messageBody = selectedMessage.text;
                    vm.action = 'edit';
                }

                vm.newMessage = function(){
                    vm.messageForm = {};
                    vm.action = 'newMessage';
                }


                vm.deleteMessage = function(message){
                    vm.disableDelete = true;
                    var url = '/query/delete-message/' + message._id;
                    console.log(url);
                    var messageIndex = vm.ticket.messages.findIndex(x => x._id === message._id);
                    queryService.submitData(url, 'DELETE').then(function(response){
                        console.log(response);
                        vm.ticket.messages.splice(messageIndex, 1);
                    }).catch(function(error){
                        console.log(error);
                        vm.disableDelete = false;
                    })
                }

                vm.markResolved = function () {
                    vm.disableMarkResolved = true;
                    var url = '/query/user/mark-resolved/' + vm.ticket._id;
                    queryService.submitData(url, 'PUT').then(function (response) {
                        console.log(response);
                        vm.ticket.resolved = true;
                    }).catch(function (response) {
                        console.log(error);
                        vm.disableMarkResolved = false;
                    })
                }

                vm.closeQuery = function(){
                    vm.disableCloseQuery = true;
                    var url = '/query/admin/close-query/' + vm.ticket._id;
                    queryService.submitData(url, 'PUT').then(function(response){
                        console.log(response);
                        vm.ticket.status = 'Closed';
                    }).catch(function(response){
                        console.log(error);
                        vm.disableCloseQuery = false;
                    })
                }
                //TODO: provide a button for this function in the view.
                vm.deleteTicket = function(){
                    vm.disableDeleteTicket = true;
                    var url = '/query/user/delete-query/' + vm.ticket._id;
                    queryService.submitData(url, 'DELETE', null)
                        .then(function(response){
                            console.log(response);
                            $location.path('/user/dashboard');
                        }).catch(function(error){
                            console.log(error);
                            vm.disableDeleteTicket = false;
                        })
                }

                vm.checkResolved = function (resolved) {
                    if (resolved) {
                        return 'badge badge-success badge-pill'
                    } else {
                        return 'badge badge-danger badge-pill'
                    }
                }

                vm.checkStatus = function(status){
                    if(status === 'Closed'){
                        return 'badge badge-success badge-pill'
                    }else{
                        return 'badge badge-danger badge-pill'

                    }

                }


            }

        })

})()