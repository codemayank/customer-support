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
                        }).catch(function (error) {
                            console.log(error);
                        })
                }
                vm.submitMessage = function () {
                    var url = '/query/submit-message/' + vm.ticket._id;
                    var message = { text: vm.messageForm.messageBody }
                    var method = 'POST';
                    console.log(vm.ticket._id);
                    if (vm.action === 'edit') {
                        url = '/query/edit-message/' + vm.ticket._id + '/' + vm.selectedMessage._id;
                        method = 'PUT',
                            console.log(url, method);
                    }
                    queryService.submitData(url, method, message).then(function (response) {
                        console.log(response);
                        vm.ticket = response.data.ticket;
                        vm.messageForm = {}
                        vm.action === 'submit';
                    }).catch(function (error) {
                        console.log(error);
                        vm.messageForm = {}
                    })
                }

                vm.selectMessage = function (selectedMessage) {
                    vm.messageForm = {};
                    console.log(selectedMessage);
                    vm.selectedMessage = selectedMessage;
                    vm.messageForm.messageBody = selectedMessage.text;
                    vm.action = 'edit';
                }

                vm.deleteMessage = function(message){
                    var url = '/query/delete-message/' + message._id;
                    console.log(url);
                    queryService.submitData(url, 'DELETE').then(function(response){
                        console.log(response);
                    }).catch(function(error){
                        console.log(error);
                    })
                }

                vm.markResolved = function () {
                    var url = '/query/user/mark-resolved/' + vm.ticket._id;
                    queryService.submitData(url, 'PUT').then(function (response) {
                        console.log(response);
                    }).catch(function (response) {
                        console.log(error);
                    })
                }

                vm.closeQuery = function(){
                    var url = '/query/admin/close-query/' + vm.ticket._id;
                    queryService.submitData(url, 'PUT').then(function(response){
                        console.log(response);
                    }).catch(function(response){
                        console.log(error);
                    })
                }
            }

        })

})()