(function () {
    'use strict';
    angular.module('app')
        .config(function ($routeProvider) {
            $routeProvider
                //declare the routes all routes have access property to check whether the given user has access to certain pages or not.
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
                .otherwise({
                    redirectTo: '/'
                });
        });


    angular.module('app').run(function ($rootScope, $location, $route, authService, Notification) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if(next.access.restricted){ //check if the route being accessed is a restricted route
                authService.getUserStatus()
                .then(function () {
                    var userRole = window.localStorage.userRole;
                    if (!authService.isLoggedIn()) { //check if the use is logged in.
                        $location.path('/')
                        $route.reload();
                    }
                    if (authService.isLoggedIn() && next.access.role != userRole) { // check if user is allowed to access the route based on their role.
                        $location.path('/'); //if not return to home page
                        Notification.danger('Access Denied').
                        $route.reload();                        
                    }
                });
            } 
        });
    });
})();