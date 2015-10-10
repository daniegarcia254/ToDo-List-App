/**
 * Created by Daniel on 10/10/2015.
 */
angular.module('toDoApp')

/**********************************************************************
 * showResultCtrl: Controller for keeping updated the table with the ToDo's
 ***********************************************************************/

    .controller('showResultCtrl', function($scope, $rootScope, $http, toDoService){

        $scope.sortType     = ''; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.searchToDo   = '';     // set the default search/filter term
        $scope.currentPage = 1;
        $scope.editingData = [];

        toDoService.getAll(function(data) {
            $rootScope.toDos = data;
            for (var i = 0, length =$rootScope.toDos.length; i < length; i++) {
                $scope.editingData[$rootScope.toDos[i].id] = false;
            }
        });

        //Removes a single ToDo identified by its [id]
        $scope.deleteToDo = function(todo) {
            toDoService.removeToDo(todo, function(){
                toDoService.getAll(function(data){
                    $rootScope.toDos = data;
                    $scope.totalItems = $rootScope.toDos.length;
                });
            });
        };

        $scope.modify = function(todo, index){
            $scope.editingData[todo._id] = true;
            $('#toDoTableDiv').find('tr:nth-child('+(index+1)+')').find('.cancel-edit-col').show();
        };

        $scope.cancelEditing = function(todo, index){
            $scope.editingData[todo._id] = false;
            $('#toDoTableDiv').find('tr:nth-child('+(index+1)+')').find('.cancel-edit-col').hide();
        };

        $scope.saveToDo = function(todo, index){
            $scope.editingData[todo._id] = false;
            toDoService.saveToDo(todo, function(){
                toDoService.getAll(function(data){
                    $rootScope.toDos = data;
                    $('#toDoTableDiv').find('tr:nth-child('+(index+1)+')').find('.cancel-edit-col').hide();
                });
            });
        };

        $scope.numPerPage = 5;
        $scope.paginate = function (todo) {
            var begin, end, index;
            begin = ($scope.currentPage - 1) * $scope.numPerPage;
            end = begin + $scope.numPerPage;
            index = $rootScope.toDos.indexOf(todo);
            return (begin <= index && index < end);
        };
    });