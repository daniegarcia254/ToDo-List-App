/**
 * Created by Daniel on 10/10/2015.
 */
angular.module('toDoApp')

/**********************************************************************
 * showResultCtrl: Controller for keeping updated the table with the ToDo's
 ***********************************************************************/

    .controller('toDosTableCtrl', function($scope, $rootScope, $http, toDoService){

        $scope.sortType     = ''; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.searchQuery   = '';     // set the default search/filter term
        $scope.checkPastToDos = false;

        //Load ToDo's
        toDoService.getAll(function(data) {
            $rootScope.toDos = data;
            $scope.totalItems = $rootScope.toDos.length;
            for (var i= 0; i<$rootScope.toDos.length; i++){
                $rootScope.toDos[i].editing = false;
            }
        });

        //Transform date into a valid format
        $scope.transformDate = function(date) {
            return date.substring(0,date.length-2);
        };

        //Removes a single ToDo identified by its [id]
        $scope.deleteToDo = function(todo) {
            toDoService.removeToDo(todo, function(){
                toDoService.getAll(function(data){
                    $rootScope.toDos = data;
                    $scope.totalItems = $rootScope.toDos.length;
                });
            });
        };

        //Allow to edit a ToDo
        $scope.modify = function(todo, index){
            todo.editing = true;
            toDoService.saveToDoEditingStatus(todo,function(){});
        };

        //Cancel a ToDo edition
        $scope.cancelEditing = function(todo, index){
            todo.editing = false;
            toDoService.saveToDoEditingStatus(todo,function(){
                toDoService.getAll(function(data){
                    if ($scope.checkPastToDos){
                        $rootScope.toDos = data.filter(function (todo) {
                            return (new Date() < new Date(todo.date));
                        });
                        $scope.totalItems = $rootScope.toDos.length;
                    } else {
                        $rootScope.toDos = data;
                    }
                    $scope.totalItems = $rootScope.toDos.length;
                });
            });
        };

        //Save a ToDo edition
        $scope.saveToDo = function(todo, index){
            todo.editing = false;
            toDoService.saveToDo(todo, function(){
                toDoService.getAll(function(data){
                    $rootScope.toDos = data;
                    $scope.totalItems = $rootScope.toDos.length;
                });
            });
        };

        //Hide/Show past ToDo's
        $scope.applyPastToDosFilter = function(){
            if ($scope.checkPastToDos){
                $rootScope.toDos = $rootScope.toDos.filter(function (todo) {
                    return (new Date() < new Date(todo.date));
                });
                $scope.totalItems = $rootScope.toDos.length;
            } else {
                toDoService.getAll(function(data) {
                    $rootScope.toDos = data;
                    $scope.totalItems = $rootScope.toDos.length;
                });
            }
        };
    });