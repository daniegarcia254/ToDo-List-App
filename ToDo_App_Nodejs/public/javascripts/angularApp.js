(function() {
  	var app = angular.module('toDoApp', ['ngAnimate']);

  	var API_URI = "http://localhost:3000/todos";	//REST endpoint URI
  
  	/*-----------------------------------
	SERVICES
  -------------------------------------*/
  	//Service to retrieve the complete TODO list of the repository
  	app.factory('ToDosService', function($http) {

	  var t = {
		  todos: []
	  };

	  t.getAll = function(cb) {
		  return $http.get(API_URI).success(cb);
	  };

	  t.getFilteredToDos = function(query, cb) {
		  return $http.get(API_URI+"/"+query).success(cb);
	  };

	  t.getFilteredToDosByPriority = function(priority, cb) {
		  return $http.get(API_URI+'/priority/'+priority).success(cb);
	  };

	  t.removeToDo = function(todo, cb) {
		  return $http.post(API_URI+"/remove", todo)
			  .success(cb)
			  .error(function(error){
			  console.log(error);
		  });
	  };

	  t.removeToDos = function(selector, query, cb) {
		  return $http.post(API_URI+"/removeMultiple/"+selector+"/"+query.toString())
			  .success(cb)
			  .error(function(error){
				  console.log(error);
			  });
	  };

	  t.createToDo = function(todo, cb) {
		  return $http.post(API_URI, todo).success(cb);
	  };

	  return t;
  });
  
  
  	/*-----------------------------------
	CONTROLLERS
  -------------------------------------*/

	//Main controller
	app.controller('MainCtrl', function($document, ToDosService, $rootScope){

		$rootScope.addTodoFormShow = $rootScope.removeTodoFormShow = false;

		$document.ready(function(){
			ToDosService.getAll(function(data){
				$rootScope.toDos = data;
			});
		});
	});

	//Controller for the action buttons
	app.controller('ActionButtonsCtrl', function($scope, $rootScope, $timeout, ToDosService){

		//Function for search in the DB the ToDo's that match the user input query
		$scope.searchToDos = function() {
			var query_bis = $scope.query;
			if (query_bis.length >= 3 ) {
				ToDosService.getFilteredToDos($scope.query, function (data) {
					$rootScope.toDos = data;
					if (data.length === 0) {
						$rootScope.errorMessage = "Not ToDo's matches found with \"" + query_bis + "\" on any fields";
					} else {
						$rootScope.errorMessage = "";
					}
				})
			} else if (query_bis.length == 0) {
				ToDosService.getAll(function(data){
					$rootScope.errorMessage = "";
					$rootScope.toDos = data;
				})
			} else {
				if (query_bis.length == 1 || query_bis.length == 2){
					if (parseInt(query_bis)){
						ToDosService.getFilteredToDosByPriority($scope.query, function (data) {
							$rootScope.toDos = data;
							if (data.length === 0) {
								$rootScope.errorMessage = "Not ToDo's matches found with priority " + query_bis;
							} else {
								$rootScope.errorMessage = "";
							}
						})
					}
				}
			}
		};

		$scope.showHideAddForm = function(){
			if ($rootScope.removeTodoFormShow){
				$rootScope.removeTodoFormShow=!$rootScope.removeTodoFormShow;
				$timeout(function(){
					$rootScope.addTodoFormShow = !$rootScope.addTodoFormShow;
				},1000);
			} else {
				$rootScope.addTodoFormShow = !$rootScope.addTodoFormShow;
			}
		};

		$scope.showHideRemoveForm = function(){
			if ($rootScope.addTodoFormShow){
				$rootScope.addTodoFormShow=!$rootScope.addTodoFormShow;
				$timeout(function(){
					$rootScope.removeTodoFormShow = !$rootScope.removeTodoFormShow;
				},1000);
			} else {
				$rootScope.removeTodoFormShow = !$rootScope.removeTodoFormShow;
			}
		};

	});

	//Controller for the "Add ToDo" form
	app.controller('addToDoFormCtrl', function($scope, $rootScope, $http, ToDosService){

		//Show & hide the form
		$rootScope.addTodoFormShow = false;
		$scope.closeAddToDoForm = function(){
			$rootScope.addTodoFormShow = !$rootScope.addTodoFormShow;
			$scope.fields = "";
		};

		//Function for add to the DB a new ToDo
		$scope.addToDo = function() {
			var todo=$scope.fields;	//Take the form fields
			$scope.fields = "";   //Clear the form

			ToDosService.createToDo(todo, function(){
				$scope.closeAddToDoForm();
				ToDosService.getAll(function(data){
					$rootScope.toDos = data;
				});
			});
		};
	});

  	//Controller for the "Remove ToDo's" form
  	app.controller('removeToDosFormCtrl', function($scope, $rootScope, $http, ToDosService, $timeout){

		$scope.selectors = fields;
		$scope.taskField = false;
		$scope.dateField = false;
		$scope.statusField = false;
		$scope.priorityField = false;

		//Show & hide the form
		$rootScope.removeTodoFormShow = false;
		$scope.closeRemoveToDoForm = function(){
			$rootScope.removeTodoFormShow = !$rootScope.removeTodoFormShow;
			$scope.selector = undefined;
			$scope.query = "";
		};

	  	//Initiate the form remove input with Task Description input
	  	if (typeof $scope.selector === 'undefined') {
		  	$rootScope.hideRemoveFormDateInput = $rootScope.hideRemoveFormStatusInput =
				$rootScope.hideRemoveFormPriorityInput = $rootScope.showRemoveFormTaskInput = true;
	  	}

	  	//Function for remove in the DB the ToDo's that match the user input query
	  	$scope.removeToDos = function() {
		  ToDosService.removeToDos($scope.selector.tag, $scope.query, function() {
			  //Get the complete list of ToDo's after removing
			  ToDosService.getAll(function(data){
				  $scope.closeRemoveToDoForm();
				  $timeout(function(){
					  $scope.checkRemoveInputType();
					  $scope.checkEnableRemoveFormSubmitButton();
				  }, 1000);
				  //Show the data on the screen
				  $rootScope.toDos = data;
				  $rootScope.errorMessage = "";
			  });
		  });
	  	};

	  	$rootScope.submitRemoveDisabled = true;
	  	//Function that handles if the submit button is enabled
	  	$scope.checkEnableRemoveFormSubmitButton = function(){
		  if (typeof $scope.selector == 'undefined') {
			  $rootScope.submitRemoveDisabled = true;
		  } else {
			  $rootScope.submitRemoveDisabled = !(typeof $scope.query != 'undefined' && $scope.query.length > 0);
		  }
	  	};

	  	//Function that handles the formulary input element change of type
	  	$scope.checkRemoveInputType = function() {
			var $parent = $('#removeToDoFormField');
			var $div = null;
			if (typeof $scope.selector == 'undefined') {
			} else {

				if ($scope.taskField || $scope.dateField || $scope.statusField || $scope.priorityField) {
					$parent.find('> .ng-scope').remove();
					$scope.query = '';
					$scope.checkEnableRemoveFormSubmitButton();
				}

				$scope.taskField = $scope.dateField = $scope.statusField = $scope.priorityField = false;

				switch ($scope.selector.tag) {
					case 'description':
						$div = $('<todo-remove-form-task-field></todo-remove-form-task-field>');
						$scope.taskField = true;
						break;
					case 'date':
						$div = $('<todo-remove-form-date-field></todo-remove-form-date-field>');
						$scope.dateField = true;
						break;
					case 'status':
						$div = $('<todo-remove-form-status-field></todo-remove-form-status-field>');
						$scope.statusField = true;
						break;
					case 'priority':
						$div = $('<todo-remove-form-priority-field></todo-remove-form-priority-field>');
						$scope.priorityField = true;
						break;
				}
				setTimeout(function () {
					angular.element($parent).injector().invoke(function ($compile) {
						var $parentScope = angular.element($parent).scope();
						$parent.append($compile($div)($parentScope));
						$parentScope.$apply();
					});
				}, 100);
			}
	  	};
  });

 	//Controller for keeping updated the table with the ToDo's
  	app.controller('showResultCtrl', function($scope, $rootScope, $http, ToDosService){

		$scope.editingData = [];
		ToDosService.getAll(function(data) {
			$rootScope.toDos = data;
			for (var i = 0, length =$rootScope.toDos.length; i < length; i++) {
				$scope.editingData[$rootScope.toDos[i].id] = false;
			}
		});
	
		//Removes a single ToDo identified by its [id]
		$scope.deleteToDo = function(todo) {
			ToDosService.removeToDo(todo, function(){
				ToDosService.getAll(function(data){
					$rootScope.toDos = data;
				});
			});
		};

		$scope.modify = function(todo){
			console.log($scope.editingData);
			$scope.editingData[todo._id] = true;
		};
  	});
  
  
  	/*-----------------------------------
	DIRECTIVES
  -------------------------------------*/
  	//Directive for show a table with ToDo's
  	app.directive('todosTable', function() {
    return {
      restrict: 'E',
      templateUrl: '/angular_directives/toDo_table.html'
    };
  });

	//Directive for show the add ToDo formulary
	app.directive('todoAddForm', function() {
		return {
			restrict: 'E',
			templateUrl: '/angular_directives/toDo_add_form.html'
		};
	});

	//Directive for show the remove ToDo's formulary
	app.directive('todoRemoveForm', function() {
		return {
			restrict: 'E',
			templateUrl: '/angular_directives/toDo_remove_form.html'
		};
	});

	//Directive for task field - remove ToDo's formulary
	app.directive('todoRemoveFormTaskField', function() {
		return {
			restrict: 'E',
			templateUrl: '/angular_directives/toDo_remove_form_task_field.html'
		};
	});
	//Directive for date field - remove ToDo's formulary
	app.directive('todoRemoveFormDateField', function() {
		return {
			restrict: 'E',
			templateUrl: '/angular_directives/toDo_remove_form_date_field.html'
		};
	});
	//Directive for status field - remove ToDo's formulary
	app.directive('todoRemoveFormStatusField', function() {
		return {
			restrict: 'E',
			templateUrl: '/angular_directives/toDo_remove_form_status_field.html'
		};
	});
	//Directive for task priority - remove ToDo's formulary
	app.directive('todoRemoveFormPriorityField', function() {
		return {
			restrict: 'E',
			templateUrl: '/angular_directives/toDo_remove_form_priority_field.html'
		};
	});
  
  
  	/*-----------------------------------
	VARIABLES
  -------------------------------------*/
  	var fields = [{
		name: "Task Description",
		tag: "description"
	}, {
		name: "Task Date",
		tag: "date"
	}, {
		name: "Task Status",
		tag: "status"
	}, {
		name: "Priority(1-10)",
		tag: "priority"
	}];
})();