var todoApp = angular.module('todoController', []);

todoApp.directive("datepicker", function () {
  	return {
    	restrict: "A",
    	require: "ngModel",
    	link: function (scope, elem, attrs, ngModelCtrl) {
      		var updateModel = function (dateText) {
        		scope.$apply(function () {
          			ngModelCtrl.$setViewValue(dateText);
        		});
      		};
      		var options = {
        		dateFormat: "yy-mm-dd",
        		onSelect: function (dateText) {
          			updateModel(dateText);
        		},
        		minDate: -0
            		// maxDate: "+1M +10D"
      		};
      		elem.datepicker(options);
    	}
  	}
});
	
// inject the Todo service factory into our controller
todoApp.controller('mainController', ['$scope', '$filter', 'Todos', function($scope, $filter, Todos) {
		$scope.formData = {};
		$scope.loading = true;
		$scope.count = 0;
		
		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		Todos.get()
			.success(function(data) {
				$scope.todos = data;
				$scope.loading = false;
				angular.forEach($scope.todos, function(todo){
         			todo.formattedCreatedOn = $filter('date')(new Date(todo.createdOn),'MMM dd, yyyy  -  hh:mm a');
      			});
			});
			
		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createTodo = function() {
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if($scope.formData.text != undefined) {
				$scope.loading = true;
				
				// call the create function from our service (returns a promise object)
				Todos.create($scope.formData)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
                		$scope.formData = {}; // clear the form so our user is ready to enter another
                		$scope.todos = data;  // assign our new list of todos
                		angular.forEach($scope.todos, function(todo){
         					todo.formattedCreatedOn = $filter('date')(new Date(todo.createdOn),'MMM dd, yyyy  -  hh:mm a');
      					});
            		});	
			}
    	};
    	
    	// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteTodo = function(id) {
			$scope.loading = true;

			Todos.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.todos = data; // assign our new list of todos
					angular.forEach($scope.todos, function(todo){
         				todo.formattedCreatedOn = $filter('date')(new Date(todo.createdOn),'MMM dd, yyyy  -  hh:mm a');
      				});
				});
		};
		
		// UPDATE ==================================================================
		// update a todo after checking it
		$scope.updateTodo = function($event, id) {
			$scope.loading = true;
			var checkbox = $event.target;
			var action = (checkbox.checked ? 'done' : 'undone');
			
			Todos.update(id, action)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.todos = data; // assign our new list of todos
					angular.forEach($scope.todos, function(todo){
         				todo.formattedCreatedOn = $filter('date')(new Date(todo.createdOn),'MMM dd, yyyy  -  hh:mm a');
      				});
				});
		};
		
		//If the end date has already past
		$scope.isGone = function (val, done) {
        	var isRed = false;
        	if (val <= moment().format('YYYY-M-D') && done != 1) {
            	isRed = true;
        	}
        	return isRed;
    	};
		
}]);

todoApp.controller('alertController', ['$scope','$filter', 'Todos', function($scope, $filter, Todos) {
		$scope.formData = {};
		$scope.loading = true;
		
		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		Todos.get()
			.success(function(data) {
				$scope.todos = [];
				$scope.loading = false;
				angular.forEach($scope.todos, function(todo){
         			todo.formattedCreatedOn = $filter('date')(new Date(todo.createdOn),'MMM dd, yyyy  -  hh:mm a');
      			});
      			for(var i = 0; i < data.length; i++) {
      				if (data[i].endDate <= moment().format('YYYY-M-D') && data[i].done != 1) {
      					$scope.todos.push(data[i]);
      				}
      			}
      			$scope.count = $scope.todos.length;
			});
    	
    	// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteTodo = function(id) {
			$scope.loading = true;

			Todos.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.todos = []; // assign our new list of todos
					angular.forEach($scope.todos, function(todo){
         				todo.formattedCreatedOn = $filter('date')(new Date(todo.createdOn),'MMM dd, yyyy  -  hh:mm a');
      				});
      				for(var i = 0; i < data.length; i++) {
      					if (data[i].endDate <= moment().format('YYYY-M-D') && data[i].done != 1) {
      						$scope.todos.push(data[i]);
      					}
      				}
      				$scope.count = $scope.todos.length;
				});
		};
		
		// UPDATE ==================================================================
		// update a todo after checking it
		$scope.updateTodo = function($event, id) {
			$scope.loading = true;
			var checkbox = $event.target;
			var action = (checkbox.checked ? 'done' : 'undone');
			
			Todos.update(id, action)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.todos = []; // assign our new list of todos
					angular.forEach($scope.todos, function(todo){
         				todo.formattedCreatedOn = $filter('date')(new Date(todo.createdOn),'MMM dd, yyyy  -  hh:mm a');
      				});
      				for(var i = 0; i < data.length; i++) {
      					if (data[i].endDate <= moment().format('YYYY-M-D') && data[i].done != 1) {
      						$scope.todos.push(data[i]);
      					}
      				}
      				$scope.count = $scope.todos.length;
				});
		};
		
}]);

/*todoApp.factory('MyService', ['$scope', '$filter', 'Todos', function($scope, $filter, Todos) {

	var sharedService = {};
	
	sharedService.getTodos = function() {
		Todos.get()
			.success(function(data) {
				$scope.todos = [];
				$scope.loading = false;
				angular.forEach($scope.todos, function(todo){
         			todo.formattedCreatedOn = $filter('date')(new Date(todo.createdOn),'MMM dd, yyyy  -  hh:mm a');
      			});
      			for (var i = 0; i < data.length; i++) {
  					// use i as an array index
  					if (data[i].endDate <= moment().format('YYYY-M-D') && data[i].done != 1) {
						$scope.todos.push(data[i]);
					}
				}
			});
	};
	
	sharedService.createTodo = function() {
				Todos.create($scope.formData)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
                		$scope.formData = {}; // clear the form so our user is ready to enter another
                		$scope.todos = data;  // assign our new list of todos
                		angular.forEach($scope.todos, function(todo){
         					todo.formattedCreatedOn = $filter('date')(new Date(todo.createdOn),'MMM dd, yyyy  -  hh:mm a');
      					});
            		});	
			
	};
	
	sharedService.deleteTodo = function(id) {
			Todos.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.todos = data; // assign our new list of todos
					angular.forEach($scope.todos, function(todo){
         				todo.formattedCreatedOn = $filter('date')(new Date(todo.createdOn),'MMM dd, yyyy  -  hh:mm a');
      				});
				});
	};
	
	sharedService.updateTodo = function(id, action) {
			Todos.update(id, action)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.todos = data; // assign our new list of todos
					angular.forEach($scope.todos, function(todo){
         				todo.formattedCreatedOn = $filter('date')(new Date(todo.createdOn),'MMM dd, yyyy  -  hh:mm a');
      				});
				});
	};

	return sharedService;
	
}]);*/
