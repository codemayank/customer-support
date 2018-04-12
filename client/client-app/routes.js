(function () {
    'use strict';

    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/landing');
            $stateProvider
                .state("user-dashBoard", {
                    url: "/user/dashboard",
                    component: "user-dashboard",
                    data: {
                        authRequired: true,
                        roles: 'userAuth'
                    }
                })
                .state("admin-dashBoard", {
                    url: "/admin/dashboard",
                    component: "admin-dashboard",
                    data: {
                        authRequired: true,
                        roles: 'adminAuth'
                    }
                })
                .state("user-login", {
                    url: "/user/login",
                    component: "user-login",
                    data: {
                        authRequired: false
                    }
                })
                .state("admin-login", {
                    url: "/admin/login",
                    component: "admin-login",
                    data: {
                        authRequired: false
                    }
                })
                .state("user-register", {
                    url: "/user/register",
                    component: "user-register",
                    data: {
                        authRequired: false
                    }
                })
                .state("admin-register", {
                    url: "/admin/register",
                    component: "admin-register",
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
                    url: "/access-denied",
                    component: "access-denied",
                    data: {
                        authRequired: false
                    }
                })
        }])

})()