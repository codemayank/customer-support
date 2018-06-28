;(function() {
  'use strict'
  angular
    .module('app')
    //user dashboard component.
    .component('userDashboard', {
      css: './client-app/templates/styles/dashboard.css',
      templateUrl: './client-app/templates/userdashboard.component.html',
      controller: function($location, authService, Notification, queryService) {
        var vm = this
        let errorMessage = { message: 'sorry there has been an error' }

        vm.username = window.localStorage.username
        //get the list of queries when the component is initialised
        vm.$onInit = function() {
          var url = 'query/user/show-queries'
          queryService
            .getQueryList(url)
            .then(function(response) {
              vm.queryList = response.data.tickets
            })
            .catch(function(error) {
              Notification.error(errorMessage)
            })
        }

        //check if the query/ticket is resolved to set the resolution status badge in the view.
        vm.checkResolved = function(resolved) {
          if (resolved) {
            return 'badge badge-success badge-pill'
          } else {
            return 'badge badge-danger badge-pill'
          }
        }
        vm.username = window.localStorage.username

        vm.logout = function() {
          authService.logout().then(function() {
            if (vm.username) {
              window.localStorage.removeItem('x-auth')
              window.localStorage.removeItem('username')
              window.localStorage.removeItem('role')
            }
            $location.path('/')
          })
        }
      }
    })
    //create query/ticket component.
    .component('createTicket', {
      css: './client-app/templates/styles/signinform.css',
      templateUrl: './client-app/templates/ticketform.component.html',
      controller: function($location, queryService) {
        let vm = this
        vm.edit = false //set the view mode to send new queries.

        vm.submitTicket = function() {
          var url = '/query/user/submit-query' //specify the url to be used in request object.
          var ticket = {
            //specify ticket data.
            qTitle: vm.queryForm.qTitle,
            qDescription: vm.queryForm.qDescription
          }
          queryService
            .submitData(url, 'POST', ticket)
            .then(function(response) {
              $location.path('/user/dashboard')
              vm.queryForm = {}
            })
            .catch(function(error) {
              Notification.error(errorMessage)
              vm.queryForm = {}
            })
        }
      }
    })
    //edit query component
    .component('editQuery', {
      css: './client-app/templates/styles/signinform.css',
      templateUrl: './client-app/templates/ticketform.component.html',
      controller: function($location, queryService, storageService) {
        let vm = this
        var query = storageService.storage //get the query data from storage service.
        vm.edit = true //set the view mode to edit queries.
        if (query) {
          vm.queryForm = {
            qTitle: query.qTitle,
            qDescription: query.qDescription
          }
        }
        //submit edited ticket.
        vm.submitTicket = function() {
          var url = 'query/user/edit-query' //specify url
          var ticket = {
            //specify ticket data
            ticket_id: query._id,
            qTitle: vm.queryForm.qTitle,
            qDescription: vm.queryForm.qDescription
          }
          queryService
            .submitData(url, 'PUT', ticket)
            .then(function(response) {
              $location.path('/user/show/' + response.data._id) //redirect to the query view.
              vm.queryForm = {}
            })
            .catch(function(error) {
              Notification.error(errorMessage)
              vm.queryForm = {}
            })
        }
      }
    })
})()
