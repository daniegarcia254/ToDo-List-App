(function() {
  var app = angular.module('toDoApp', []);

  var API_URI = "http://localhost:3000/todos";	//REST endpoint URI
  
  /*-----------------------------------
	SERVICES
  -------------------------------------*/
  //Service to retrieve the complete ToDo list of the repository
  app.factory('ToDosService', function($http) {

	  var t = {
		  todos: []
	  };

	  t.getAll = function() {
			return $http.get(API_URI).success(function(data){
				angular.copy(data, t.todos);
			});
	  };

	  return t;
  });
  
  
  /*-----------------------------------
	CONTROLLERS
  -------------------------------------*/
  //Controller for the navigation bar
  app.controller('HomeCtrl', function($scope){
    $scope.tabs = actions;
  });
  
  //Controller for navigation tabs
  app.controller('tabCtrl', ['$scope', '$rootScope', 'ToDosService', function($scope, $rootScope, ToDosService){

	$rootScope.toDos = ToDosService.todos;

	$scope.getToDoList = function(tabName){

		ToDosService.getAll();

		$rootScope.errorMessage = "";
		if (tabName == 'add') $rootScope.hideValue = "true";
		else if (tabName == 'list') $rootScope.hideValue = "true";
		else if (tabName = 'remove') $rootScope.hideValue = "false";
	};
  }]);

  //Controller for the "Add ToDo" form
  app.controller('addToDoFormCtrl', ['$scope', '$rootScope', '$http', 'ToDosService', function($scope, $rootScope, $http, ToDosService){
	$scope.addToDo = function() {
		var todo=$scope.fields;	//Take the form fields
		$scope.fields = "";  //Clean the form

		//Make a POST call to add the ToDo to the repository
		var res = $http.post(API_URI, todo);
		res.success(function(data, status, headers, config) {
			ToDosService.getAll(function(data) {
				$rootScope.toDos = data;
			});
		});
		res.error(function(data, status, headers, config) {
			alert( "failure message: " + JSON.stringify({data: data}));
		});
	};
  }]);

  //Controller for the "List ToDo's" form
   app.controller('listToDosFormCtrl', ['$scope', '$rootScope', '$http', 'ToDosService', function($scope, $rootScope, $http, ToDosService){
    $scope.selectors = fields;
	$scope.listToDos = function() {
		var query_bis = $scope.query;
		$http.get(API_URI+'/list/'+$scope.selector.tag+'/'+$scope.query)
			.success(function(data, status, headers, config) {
				$rootScope.toDos = data;
				$rootScope.errorMessage = "";
			})
			.error(function(data, status, headers, config) {
				$rootScope.toDos = [];
				$rootScope.errorMessage = "Not ToDo's matches found with \"" + $scope.selector.tag + "= " + query_bis + "\"";
			});
		$scope.query = "";
	};
	$scope.numberOrText = function(){
		console.log($scope.selector);
	}
  }]);

  //Controller for the "List All ToDo's" form
   app.controller('listAllFormCtrl', ['$scope', '$rootScope', '$http', 'ToDosService', function($scope, $rootScope, $http, ToDosService){
	$scope.listAll = function() {
		//Uses the a service for get the list
		ToDosService.getAll(function(data) {
			$rootScope.toDos = data;
			if (data.toDoList.length === 0){
				$rootScope.errorMessage = "The repository is empty!";
			} else {
				$rootScope.errorMessage = "";
			}
		});
	};
  }]);

  //Controller for the "Remove ToDo's" form
   app.controller('removeToDosFormCtrl', ['$scope', '$rootScope', '$http', 'ToDosService', function($scope, $rootScope, $http, ToDosService){
    $scope.selectors = fields;
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
	};
  }]);

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
	$scope.deleteToDo = function(id) {
		//alert(id);
		$http.delete(API_URI+'/remove/'+id)
			.success(function(data, status, headers, config) {
				$rootScope.toDos = data;
				$rootScope.errorMessage = "";
			})
			.error(function(data, status, headers, config) {
				$rootScope.toDos = [];
				$rootScope.errorMessage = "Error deleting the ToDo with id = "+id;
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
      templateUrl: '/angular_directives/toDo-table.html'
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