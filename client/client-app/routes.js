(function () {
    'use strict';
    angular.module('app')
        .config(function($routeProvider){
            $routeProvider
                .when('/', {
                    template : '<landing></landing>',
                    access : {
                        restricted: false
                    }
                })
                .when('/user/login', {
                    template : '<user-login></user-login',
                    access : {
                        restricted : false
                    }
                })
                .when('/user/register', {
                    template : '<user-register></user-register>',
                    access : {
                        restricted : false
                    }
                })
                .when('/user/dashboard', {
                    template : '<user-dashboard></user-dashboard>',
                    access : {
                        restricted : true,
                        role : 'User'
                    }
                })
                .when('/admin/login', {
                    template : '<admin-login></admin-login>',
                    access : {
                        restricted : false
                    }
                })
                .when('/admin/register', {
                    template : '<admin-register></admin-register>',
                    access : {
                        restricted : false
                    }
                })
                .when('/admin/dashboard', {
                    template : '<admin-dashboard></admin-dashboard>',
                    access : {
                        restricted : true,
                        role : 'Admin'
                    }
                })
                .when('/access-denied', {
                    template : '<access-denied></access-denied>',
                    access : {
                        restricted : false
                    }
                })
                .otherwise({
                    redirectTo : '/'
                });

            angular.module('app').run(function($rootScope, $location, $route, authService){
                $rootScope.on('$routeChangeStart', function(event, next, current){
                    authService.getUserStatus()
                        .then(function(){
                            if(next.access.restricted && !authService.isLoggedIn()){
                                console.log(authService.isLoggedIn())
                                $location.path('/login');
                                $route.reload();
                            }
                            if(authService.isLoggedIn && next.access.role != authService.userRole){
                                console.log('access denied');
                                $location.path('/access-denied');
                                $route.reload();
                            }
                        });
                });
            });
        });
})();