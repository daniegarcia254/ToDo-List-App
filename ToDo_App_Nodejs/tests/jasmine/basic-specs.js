describe("Basic unit tests", function(){

	//beforeEach(module('toDoApp', ['ngAnimate', 'ngResource', 'ui.bootstrap']));
	beforeEach(module('toDoApp'));
  	beforeEach(function() {
  		module('ngAnimate');
  		module('ngResource');
    	module('ui.bootstrap');
  	});

	var MainController, scope;

	beforeEach(inject(function ($rootScope, $controller) {
		scope = $rootScope.$new();
		MainController = $controller('mainCtrl', {
			$scope: scope
		});
	}));

	it("Should have false vars", function(){
		expect(scope.addTodoFormShow).toBeFalsy();
		expect(scope.removeTodoFormShow).toBeFalsy();
	})
});