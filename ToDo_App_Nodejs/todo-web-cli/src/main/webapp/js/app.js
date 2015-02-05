(function() {
  var app = angular.module('toDoApp', []);

  var API_URI = "http://localhost:8080/todolist";	//REST endpoint URI
  
  /*-----------------------------------
	SERVICES
  -------------------------------------*/
  //Service to retrieve the complete ToDo list of the repository
  app.factory('toDoListService', function($http) {
	   return {
		getToDoList: function(callback) {
			$http.get(API_URI).success(callback);
		}
	   }
  });
  
  
  /*-----------------------------------
	CONTROLLERS
  -------------------------------------*/
  //Controller for the navigation bar
  app.controller('HomeCtrl', function($scope){
    $scope.tabs = actions;
  });
  
  //Controller for navigation tabs
  app.controller('tabCtrl', ['$scope', '$rootScope', 'toDoListService', function($scope, $rootScope, toDoListService){
	$scope.getToDoList = function(tabName){
		//Uses the a service for get the list
		toDoListService.getToDoList(function(data) {
			$rootScope.toDos = data.toDoList;
		});
		$rootScope.errorMessage = "";
		if (tabName == 'add') $rootScope.hideValue = "true";
		else if (tabName == 'list') $rootScope.hideValue = "true";
		else if (tabName = 'remove') $rootScope.hideValue = "false";
	};
  }]);
  
  //Controller for the "Add ToDo" form
  app.controller('addToDoFormCtrl', ['$scope', '$rootScope', '$http', 'toDoListService', function($scope, $rootScope, $http, toDoListService){
	$scope.addToDo = function() {
		var todo=$scope.fields;	//Take the form fields
		$scope.fields = "";  //Clean the form
		
		//Make a POST call to add the ToDo to the repository
		var res = $http.post(API_URI, todo);
		res.success(function(data, status, headers, config) {
			toDoListService.getToDoList(function(data) {
				$rootScope.toDos = data.toDoList;
			});
		});
		res.error(function(data, status, headers, config) {
			alert( "failure message: " + JSON.stringify({data: data}));
		});
	};
  }]);
  
  //Controller for the "List ToDo's" form
   app.controller('listToDosFormCtrl', ['$scope', '$rootScope', '$http', 'toDoListService', function($scope, $rootScope, $http, toDoListService){
    $scope.selectors = fields;
	$scope.listToDos = function() {
		var query_bis = $scope.query;
		$http.get(API_URI+'/list/'+$scope.selector.tag+'/'+$scope.query)
			.success(function(data, status, headers, config) {
				$rootScope.toDos = data.toDoList;
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
   app.controller('listAllFormCtrl', ['$scope', '$rootScope', '$http', 'toDoListService', function($scope, $rootScope, $http, toDoListService){
	$scope.listAll = function() {
		//Uses the a service for get the list
		toDoListService.getToDoList(function(data) {
			$rootScope.toDos = data.toDoList;
			if (data.toDoList.length === 0){
				$rootScope.errorMessage = "The repository is empty!";
			} else {
				$rootScope.errorMessage = "";
			}
		});
	};
  }]);
  
  //Controller for the "Remove ToDo's" form
   app.controller('removeToDosFormCtrl', ['$scope', '$rootScope', '$http', 'toDoListService', function($scope, $rootScope, $http, toDoListService){
    $scope.selectors = fields;
	$scope.removeToDos = function() {
		var query_bis = $scope.query;
		$http.delete(API_URI+'/remove/'+$scope.selector.tag+'/'+$scope.query)
			.success(function(data, status, headers, config) {
				$rootScope.toDos = data.toDoList;
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
   app.controller('removeAllFormCtrl', ['$scope', '$rootScope', '$http', 'toDoListService', function($scope, $rootScope, $http, toDoListService){
	$scope.removeAll = function() {
		$http.delete(API_URI+'/removeAll')
			.success(function(data, status, headers, config) {
				$rootScope.toDos = data.toDoList;
				$rootScope.errorMessage = "All the ToDo's have been removed from the repository!";
			})
			.error(function(data, status, headers, config) {
				$rootScope.toDos = [];
				$rootScope.errorMessage = "Error emptying the repository!";
			});
	};
  }]);

  //Controller for keeping updated the table with the ToDo's
  app.controller('showResultCtrl', ['$scope', '$rootScope', '$http', 'toDoListService', function($scope, $rootScope, $http, toDoListService){
	toDoListService.getToDoList(function(data) {
		$rootScope.toDos = data.toDoList;
	});
	
	//Removes a single ToDo identified by its [id]
	$scope.deleteToDo = function(id) {
		//alert(id);
		$http.delete(API_URI+'/remove/'+id)
			.success(function(data, status, headers, config) {
				$rootScope.toDos = data.toDoList;
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
      templateUrl: 'toDo-table.html'
    };
  });
  
  
  
  /*-----------------------------------
	VARIABLES
  -------------------------------------*/
  var actions = [{
		title: 'Add ToDo',
		description: "This will allow to you add a ToDo task to the repository.",
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