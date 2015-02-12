(function() {
  var app = angular.module('toDoApp', ['ngAnimate']);

  var API_URI = "http://localhost:3000/todos";	//REST endpoint URI
  
  /*-----------------------------------
	SERVICES
  -------------------------------------*/
  //Service to retrieve the complete ToDo list of the repository
  app.factory('ToDosService', function($http, $rootScope) {

	  var t = {
		  todos: []
	  };

	  t.getAll = function(cb) {
		  return $http.get(API_URI).success(cb);
	  };

	  t.getFilteredToDos = function(tag, query, cb) {
		  return $http.get(API_URI+"/"+tag+"/"+query).success(cb);
	  };

	  t.removeToDo = function(todo, cb) {
		  return $http.post(API_URI+"/remove", todo)
			  .success(cb)
			  .error(function(error){
			  console.log(error);
		  });
	  };

	  t.create = function(todo, cb) {
		  return $http.post(API_URI, todo).success(cb);
	  };

	  return t;
  });
  
  
  /*-----------------------------------
	CONTROLLERS
  -------------------------------------*/

	//Main controller
	app.controller('MainCtrl', function($document, ToDosService, $rootScope){
		$document.ready(function(){
			ToDosService.getAll(function(data){
				$rootScope.toDos = data;
			});
		});
	});

	//Controller for the action buttons
	app.controller('ActionButtonsCtrl', function($scope, $rootScope, $timeout, ToDosService){

		$scope.listAll = function(){
			ToDosService.getAll(function(data){
				$rootScope.toDos = data;
			});
		};

		$scope.showHideAddForm = function(){
			if ($rootScope.searchTodoFormShow) {
				$rootScope.searchTodoFormShow=!$rootScope.searchTodoFormShow;
				$timeout(function(){
					$rootScope.addTodoFormShow = !$rootScope.addTodoFormShow;
				},1000);
			} else if ($rootScope.removeTodoFormShow){
				$rootScope.removeTodoFormShow=!$rootScope.removeTodoFormShow;
				$timeout(function(){
					$rootScope.addTodoFormShow = !$rootScope.addTodoFormShow;
				},1000);
			} else {
				$rootScope.addTodoFormShow = !$rootScope.addTodoFormShow;
			}
		};

		$scope.showHideSearchForm = function(){
			if ($rootScope.addTodoFormShow) {
				$rootScope.addTodoFormShow=!$rootScope.addTodoFormShow;
				$timeout(function(){
					$rootScope.searchTodoFormShow = !$rootScope.searchTodoFormShow;
				},1000);
			} else if ($rootScope.removeTodoFormShow){
				$rootScope.removeTodoFormShow=!$rootScope.removeTodoFormShow;
				$timeout(function(){
					$rootScope.searchTodoFormShow = !$rootScope.searchTodoFormShow;
				},1000);
			} else {
				$rootScope.searchTodoFormShow = !$rootScope.searchTodoFormShow;
			}
		};

		$scope.showHideRemoveForm = function(){
			if ($rootScope.searchTodoFormShow) {
				$rootScope.searchTodoFormShow=!$rootScope.searchTodoFormShow;
				$timeout(function(){
					$rootScope.removeTodoFormShow = !$rootScope.removeTodoFormShow;
				},1000);
			} else if ($rootScope.addTodoFormShow){
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
		};

		//Function for add to the DB a new ToDo
		$scope.addToDo = function() {
			var todo=$scope.fields;	//Take the form fields
			$scope.fields = "";   //Clear the form

			ToDosService.create(todo, function(){
				$scope.closeAddToDoForm();
				ToDosService.getAll(function(data){
					$rootScope.toDos = data;
				});
			});
		};
	});

  //Controller for the "Search ToDo's" form
   app.controller('searchToDosFormCtrl', function($scope, $rootScope, $http, ToDosService, $timeout){

	   //Show & hide the form
	   $rootScope.searchTodoFormShow = false;
	   $scope.closeSearchToDoForm = function(){
		   $rootScope.searchTodoFormShow = !$rootScope.searchTodoFormShow;
	   };

	   //Initiate the form search input as text type
	   if (typeof $scope.selector === 'undefined') {
		   $rootScope.hideInputSearchPriority = $rootScope.showInputSearch = true;
	   }

	   $scope.selectors = fields;

	   //Function for search in the DB the ToDo's that match the user input query
	   $scope.searchToDos = function() {
			var query_bis = $scope.query;
			/*$http.get(API_URI+'/list/'+$scope.selector.tag+'/'+$scope.query)
				.success(function(data, status, headers, config) {
					$rootScope.toDos = data;
					$rootScope.errorMessage = "";
				})
				.error(function(data, status, headers, config) {
					$rootScope.toDos = [];
					$rootScope.errorMessage = "Not ToDo's matches found with \"" + $scope.selector.tag + "= " + query_bis + "\"";
				});*/

			/*ToDosService.getFilteredToDos($scope.selector.tag, $scope.query, function(){
				$rootScope.toDos = ToDosService.todos;
			});*/
		   ToDosService.getFilteredToDos($scope.selector.tag, $scope.query, function(data){
			   $rootScope.toDos = data;
			   if (data.length === 0){
				   $rootScope.errorMessage = "Not ToDo's matches found with \"" + $scope.selector.tag + "= " + query_bis + "\"";
			   } else {
				   $rootScope.errorMessage = "";
			   }
		   });

			$scope.query = "";
		    $scope.checkEnableSearchFormSubmitButton();
	   };

	   $rootScope.submitSearchDisabled = true;
	   //Function that handles if the submit button is enabled
	   $scope.checkEnableSearchFormSubmitButton = function(element){
		   if (typeof $scope.selector == 'undefined') {
			   $rootScope.submitSearchDisabled = true;
		   } else {
			   $rootScope.submitSearchDisabled =  !(typeof $scope.query != 'undefined' && $scope.query.length > 0);
		   }
	   };

	   //Function that handles the formulary input element change of type
	   $scope.checkSearchInputType = function() {
		   if (typeof $scope.selector === 'undefined') {
			   $rootScope.hideInputSearchPriority = $rootScope.showInputSearch = true;
		   } else {
			   if ($scope.selector.tag != 'priority') {
				   $rootScope.hideInputSearchPriority = true;
				   $timeout(function () {
					   $rootScope.showInputSearch = true;
				   }, 500);
			   } else {
				   $rootScope.showInputSearch = false;
				   $timeout(function () {
					   $rootScope.hideInputSearchPriority = false;
				   }, 500);
			   }
		   };
	   };
  });

  //Controller for the "Remove ToDo's" form
  app.controller('removeToDosFormCtrl', function($scope, $rootScope, $http, ToDosService, $timeout){

	  //Show & hide the form
	  $rootScope.removeTodoFormShow = false;
	  $scope.closeRemoveToDoForm = function(){
		  $rootScope.removeTodoFormShow = !$rootScope.removeTodoFormShow;
	  };

	  //Initiate the form remove input as text type
	  if (typeof $scope.selector === 'undefined') {
		  $rootScope.hideInputRemovePriority = $rootScope.showInputRemove = true;
	  }

	  $scope.selectors = fields;
	  //Function for remove in the DB the ToDo's that match the user input query
	  $scope.removeToDos = function() {
		  var query_bis = $scope.query;
		  $http.delete(API_URI+'/remove/'+$scope.selector.tag+'/'+$scope.query)
			  .success(function(data, status, headers, config) {
				  $rootScope.toDos = data;
				  $rootScope.errorMessage = "";
			  })
			  .error(function(data, status, headers, config) {
				  $rootScope.toDos = [];
				  $rootScope.errorMessage = "Not ToDo's matches found with \"" + $scope.selector.tag + "= " + query_bis + "\"";
			  });
		  $scope.query = "";
		  $scope.checkEnableRemoveFormSubmitButton();
	  };

	  $rootScope.submitRemoveDisabled = true;
	  //Function that handles if the submit button is enabled
	  $scope.checkEnableRemoveFormSubmitButton = function(element){
		  if (typeof $scope.selector == 'undefined') {
			  $rootScope.submitRemoveDisabled = true;
		  } else {
			  $rootScope.submitRemoveDisabled =  !(typeof $scope.query != 'undefined' && $scope.query.length > 0);
		  }
	  };

	  //Function that handles the formulary input element change of type
	  $scope.checkRemoveInputType = function() {
		  if (typeof $scope.selector === 'undefined') {
			  $rootScope.hideInputRemovePriority = $rootScope.showInputRemove = true;
		  } else {
			  if ($scope.selector.tag != 'priority') {
				  $rootScope.hideInputRemovePriority = true;
				  $timeout(function () {
					  $rootScope.showInputRemove = true;
				  }, 500);
			  } else {
				  $rootScope.showInputRemove = false;
				  $timeout(function () {
					  $rootScope.hideInputRemovePriority = false;
				  }, 500);
			  }
		  };
	  };
  });

  //Controller for the "Remove All ToDo's" form
   app.controller('removeAllFormCtrl', ['$scope', '$rootScope', '$http', 'ToDosService', function($scope, $rootScope, $http, ToDosService){
	$scope.removeAll = function() {
		$http.delete(API_URI+'/removeAll')
			.success(function(data, status, headers, config) {
				$rootScope.toDos = data;
				$rootScope.errorMessage = "All the ToDo's have been removed from the repository!";
			})
			.error(function(data, status, headers, config) {
				$rootScope.toDos = [];
				$rootScope.errorMessage = "Error emptying the repository!";
			});
	};
  }]);

  //Controller for keeping updated the table with the ToDo's
  app.controller('showResultCtrl', ['$scope', '$rootScope', '$http', 'ToDosService', function($scope, $rootScope, $http, ToDosService){
	ToDosService.getAll(function(data) {
		$rootScope.toDos = data;
	});
	
	//Removes a single ToDo identified by its [id]
	$scope.deleteToDo = function(todo) {
		/*$http.delete(API_URI)
			.success(function(data, status, headers, config) {
				$rootScope.toDos = data;
				$rootScope.errorMessage = "";
			});*/

		ToDosService.removeToDo(todo, function(){
			ToDosService.getAll(function(data){
				$rootScope.toDos = data;
			});
		});
	};
  }]);
  
  
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

	//Directive for show the search ToDo's formulary
	app.directive('todoSearchForm', function() {
		return {
			restrict: 'E',
			templateUrl: '/angular_directives/toDo_search_form.html'
		};
	});

	//Directive for show the remove ToDo's formulary
	app.directive('todoRemoveForm', function() {
		return {
			restrict: 'E',
			templateUrl: '/angular_directives/toDo_remove_form.html'
		};
	});
  
  
  
  /*-----------------------------------
	VARIABLES
  -------------------------------------*/
  var actions = [{
		title: 'Add ToDo',
		description: "This will allow to you add a ToDo task to the repository."
    }, {
		title: 'List ToDo\'s',
		description: "This will allow you to list all the repository ToDo's or make a filtered search of ToDo's by any of its fields."
	}, {
		title: 'Remove ToDo\'s',
		description: "This will allow you to remove all ToDo's from the repository or to remove only a few (through a filtered search)."
    }];
	
  var fields = [{
		name: "Task Description",
		tag: "description"
	}, {
		name: "Task Context",
		tag: "context"
	}, {
		name: "Task Project",
		tag: "project"
	}, {
		name: "Priority(1-10)",
		tag: "priority"
	}];
})();