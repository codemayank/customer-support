(function () {
    'use strict';
    angular.module('app')
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    template: '<landing></landing>',
                    access: {
                        restricted: false
                    }
                })
                .when('/signin/:userType/:action', {
                    template: '<sign-in></sign-in>',
                    access: {
                        restricted: false
                    }
                })
                .when('/user/dashboard', {
                    template: '<user-dashboard></user-dashboard>',
                    access: {
                        restricted: true,
                        role: 'userAuth'
                    }
                })
                .when('/user/create-ticket',{
                    template: '<create-ticket></create-ticket>',
                    access: {
                        restricted : true,
                        role : 'userAuth'
                    }
                })
                .when('/user/show/:query_id', {
                    template : '<query-detail></query-detail>',
                    access : {
                        restricted : true,
                        role : 'userAuth'
                    }
                })
                .when('/user/:query_id/edit-ticket', {
                    template : '<edit-query></edit-query>',
                    access : {
                        restricted : true,
                        role : 'userAuth'
                    }
                })
                .when('/admin/dashboard', {
                    template: '<admin-dashboard></admin-dashboard>',
                    access: {
                        restricted: true,
                        role: 'adminAuth'
                    }
                })
                .when('/admin/show/:query_id', {
                    template: '<query-detail></query-detail>',
                    access:{
                        restricted : true,
                        role: 'adminAuth'
                    }
                })
                .when('/access-denied', {
                    template: '<access-denied></access-denied>',
                    access: {
                        restricted: false
                    }
                })
                .otherwise({
                    redirectTo: '/'
                });
        });


    angular.module('app').run(function ($rootScope, $location, $route, authService) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if(next.access.restricted){
                authService.getUserStatus()
                .then(function () {
                    var userRole = window.localStorage.userRole;
                    if (!authService.isLoggedIn()) {
                        console.log(authService.isLoggedIn())
                        $location.path('/')
                        $route.reload();
                    }
                    if (authService.isLoggedIn() && next.access.role != userRole) {
                        console.log('access denied');
                        $location.path('/access-denied');
                        $route.reload();
                    }
                });
            } 
        });
    });
})();