/**
 * Created by Daniel on 10/10/2015.
 */
angular.module('toDoApp')

/**********************************************************************
 * addToDoFormCtrl: //Controller for the "Add ToDo" form
 ***********************************************************************/

    .controller('addToDoFormCtrl', function($scope, $rootScope, $http, toDoService){

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

            toDoService.createToDo(todo, function(){
                $scope.closeAddToDoForm();
                toDoService.getAll(function(data){
                    $rootScope.toDos = data;
                });
            });
        };
    });