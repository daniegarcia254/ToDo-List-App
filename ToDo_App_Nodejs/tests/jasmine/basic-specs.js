describe("Basic unit tests", function(){

	beforeEach(module('toDoApp'));
  	beforeEach(function() {
  		module('ngAnimate');
  		module('ngResource');
    	module('ui.bootstrap');
  	});

	var $controller;

	beforeEach(inject(function(_$controller_){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
	}));

	describe('$scope.grade', function() {

		var controller, $scope = null;

		beforeEach(function(){
			$scope = {};
			controller = $controller('mainCtrl', { $scope: $scope });
		});

		it('sets the strength to "strong" if the password length is >8 chars', function() {
			expect($scope.addTodoFormShow).toBeFalsy();
			expect($scope.removeTodoFormShow).toBeFalsy();
		});
	});
});