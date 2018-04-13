(function () {
    'use strict';

    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/landing');
            $stateProvider
                .state("user-dashBoard", {
                    url: "/user/dashboard",
                    component: "userDashboard",
                    data: {
                        authRequired: true,
                        roles: 'userAuth'
                    }
                })
                .state("admin-dashBoard", {
                    url: "/admin/dashboard",
                    component: "admiDashboard",
                    data: {
                        authRequired: true,
                        roles: 'adminAuth'
                    }
                })
                .state("user-login", {
                    url: "/user/login",
                    component: "userLogin",
                    data: {
                        authRequired: false
                    }
                })
                .state("admin-login", {
                    url: "/admin/login",
                    component: "adminLogin",
                    data: {
                        authRequired: false
                    }
                })
                .state("user-register", {
                    url: "/user/register",
                    component: "userRegister",
                    data: {
                        authRequired: false
                    }
                })
                .state("admin-register", {
                    url: "/admin/register",
                    component: "adminRegister",
                    data: {
                        authRequired: false
                    }
                })
                .state("landing", {
                    url: "/landing",
                    component: "landing",
                    data: {
                        authRequired: false
                    }
                })
                .state("access-denied", {
                    url: "/accessDenied",
                    component: "accessDenied",
                    data: {
                        authRequired: false
                    }
                })
        }])

})()