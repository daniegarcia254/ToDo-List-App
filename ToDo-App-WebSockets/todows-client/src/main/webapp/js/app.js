(function() {
  var app = angular.module('toDoApp', []);

  	var wb_endpoint = "ws://localhost:8025/websockets/todos";
	var webSocket;

	/*-----------------------------------
	 MAIN CONTROLLER
	  * It controls the websocket behaviour & the error handling on failed connection
	 -------------------------------------*/
	app.controller('MainCtrl', function($scope, $rootScope){

		$rootScope.wb_endpoint = wb_endpoint;

		//Variables for controlling error messaging shows/hide
		$rootScope.lostConnection = false;
		$rootScope.closedConnection = false;
		$rootScope.tryAgain = false;

		//Function that control the websocket communication behaviour
		$scope.openSocket = function(){

			// Ensures only one connection is open at a time
			if(webSocket !== undefined && webSocket.readyState !== WebSocket.CLOSED){
				console.log("WebSocket is already opened.");
				return;
			} else {
				// Create a new instance of the websocket
				$rootScope.disableReset = true;
				webSocket = new WebSocket(wb_endpoint);
				console.log("WebSocket opened")
			}

			 //Binds functions to the listeners for the websocket.
			webSocket.onopen = function(){
				$rootScope.lostConnection = false;
				$rootScope.closedConnection = false;
				$scope.loadFile();
			};

			//Error handling on closed or lost connection mainly
			webSocket.onerror=function(){
				if (!($rootScope.closedConnection))
					$rootScope.lostConnection = true;

				$rootScope.tryAgain = !$rootScope.tryAgain;
				$rootScope.$apply();
			};

			//WebSocket message receive handling
			webSocket.onmessage = function(event){
				switch (event.data.substr(0,event.data.indexOf(":"))) {
					case "toDoList":
						$scope.toDos = JSON.parse(event.data.substr(event.data.indexOf(":")+2,event.data.length-1));
						if ($scope.toDos.length == 0){ $rootScope.errorMessage = "ToDo's list is empty";
						} else {$rootScope.errorMessage = ""; }
						break;
					default:
						console.log(event.data);
				}
				$rootScope.$apply();
			};

			//Show error on WebSocket close
			webSocket.onclose = function() {
				if (!($rootScope.lostConnection))
					$rootScope.closedConnection = true;
			};
		};

		//Request to the WebSocket for load the server repository ToDos List
		$scope.loadFile = function(){
			webSocket.send("loadFile:");
		};

		//Request to the WebSocket for reset the ToDos List
		$scope.resetToDos = function(){
			webSocket.send("resetToDoFile:");
			$rootScope.disableReset = true;
		};

		//MAIN & UNIQUE CALL in the MAIN CONTROLLER
		$scope.openSocket();
	});
  
  /*-----------------------------------
	CONTROLLERS
  -------------------------------------*/
  //Controller for the navigation bar
  app.controller('HomeCtrl', function($scope){
    $scope.tabs = actions;
  });

  //Controller for navigation tabs
  app.controller('tabCtrl', ['$scope', '$rootScope', function($scope, $rootScope){

	  //Every time we change tab, updates the ToDo_List
	  $scope.getToDoList = function(tabName){
		switch (tabName){
			case "add":
				$rootScope.hideValue = "true";
				webSocket.send("getTodoList:");
				break;
			case "list":
				$rootScope.hideValue = "true";
				break;
			case "remove":
				$rootScope.hideValue = "false";
				webSocket.send("getTodoList:");
				break;
			default:
				webSocket.send("getTodoList:");
				break;
		}
	};
  }]);
  
  //Controller for the "Add_ToDo" form
  app.controller('addToDoFormCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope){

	  $scope.addToDo = function() {
		  $rootScope.disableReset = true;
		  var todo = $scope.fields;
		  //Convierte los campos del formulario a formato JSON y lo envía al WebSocket endpoint
		  todoJSON.task = todo.task;
		  todoJSON.context = todo.context;
		  todoJSON.project = todo.project;
		  todoJSON.priority = todo.priority;
		  webSocket.send("addTodo:"+JSON.stringify(todo));
		  $scope.fields = "";
	  };
  }]);

  //Controller for the "List ToDos" form
   app.controller('listToDosFormCtrl', ['$scope', function($scope){
		$scope.selectors = fields;
		$scope.listToDos = function() {
			webSocket.send("queryToDos:"+$scope.selector.tag+":"+$scope.query);
			$scope.query = "";
		};
  }]);
  
  //Controller for the "List All ToDos" form
   app.controller('listAllFormCtrl', ['$scope', function($scope){
		$scope.listAll = function() {
			webSocket.send("getTodoList:");
		};
  }]);
  
  //Controller for the "Remove ToDos" form
   app.controller('removeToDosFormCtrl', ['$scope', function($scope){
		$scope.selectors = fields;
		$scope.removeToDos = function() {
			webSocket.send("removeQueryToDos:"+$scope.selector.tag+":"+$scope.query);
			$scope.query = "";
		};
  }]);
  
  //Controller for the "Remove All ToDos" form
   app.controller('removeAllFormCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
		$scope.removeAll = function() {
			webSocket.send("removeAllToDos:");
			$rootScope.disableReset = false;
		};
  }]);

  //Controller for keeping updated the table with the ToDos
  app.controller('showResultCtrl', ['$scope', function($scope){
		//Removes a single _ToDo identified by its [id]
		$scope.deleteToDo = function(id) {
			webSocket.send("removeOneToDo:"+id);
		};
  }]);

  
  /*-----------------------------------
	DIRECTIVES
  -------------------------------------*/
  //Directive for show a table with ToDos
  app.directive('todosTable', function() {
    return {
      restrict: 'E',
      templateUrl: 'toDo-table.html'
    };
  });

	//Directive for show error Message on open connection
	app.directive('errorMessage', function() {
		return {
			restrict: 'E',
			templateUrl: 'error-message.html'
		};
	});

	//Directive for show error Message on closed connection
	app.directive('conClosedMessage', function() {
		return {
			restrict: 'E',
			templateUrl: 'con-closed-message.html'
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

	var todoJSON = {
		"task": "",
		"context": "",
		"project": "",
		"priority": ""
	};
})();