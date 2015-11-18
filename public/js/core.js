var app = angular.module('todo', ['ngRoute', 'todoController', 'todoService']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', 
		{
			templateUrl: "app.html",
			controller: "mainController"
		})
		.when('/NewTask',
		{
			templateUrl: "newtasksheet.html",
			controller: "mainController"
		})
		.when('/Alerts',
		{
			templateUrl: "alerts.html",
			controller: "alertController"
		})
		.otherwise({ redirectTo: "/"});
}]);
