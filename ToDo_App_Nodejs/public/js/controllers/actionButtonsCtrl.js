/**
 * Created by Daniel on 10/10/2015.
 */
angular.module('toDoApp')

/**********************************************************************
 * actionButtonsCtrl: Controller for the action buttons
 ***********************************************************************/

    .controller('actionButtonsCtrl', function($scope, $rootScope, $timeout){

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