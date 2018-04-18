(function () {
    'use strict';
    angular.module('app')
        .component('adminDashboard', {
            css: './client-app/templates/styles/dashboard.css',
            templateUrl: './client-app/templates/admindashboard.component.html',
            controller: function ($http, $location, authService, Notification, queryService) {
                var vm = this;
                vm.$onInit = function () {
                    var url = '/query/admin/show-queries'
                    queryService.getQueryList(url)
                        .then(function (response) {
                            vm.queryList = response.data.tickets
                        }).catch(function (error) {
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

                vm.checkStatus = function(status){
                    if(status === 'Closed'){
                        return 'badge badge-success badge-pill'
                    }else{
                        return 'badge badge-danger badge-pill'

                    }
                }

            }
        })
})();