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
        $scope.currentPage = 1;
        $scope.editingData = [];
        $scope.checkPastToDos = false;
        $scope.toDosBeingEdited = [];

        //Load ToDo's
        toDoService.getAll(function(data) {
            $rootScope.toDos = data;
            $scope.totalItems = $rootScope.toDos.length;
            for (var i = 0, length =$rootScope.toDos.length; i < length; i++) {
                $scope.editingData[$rootScope.toDos[i].id] = false;
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
            $scope.editingData[todo._id] = true;
            $('#toDoTableDiv').find('tr:nth-child('+(index+1)+')').find('.cancel-edit-col').show();
            $scope.toDosBeingEdited.push(todo);
            console.log($scope.toDosBeingEdited[0]);
        };

        //Cancel a ToDo edition
        $scope.cancelEditing = function(todo, index){
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
               $scope.editingData[todo._id] = false;
               $('#toDoTableDiv').find('tr:nth-child('+(index+1)+')').find('.cancel-edit-col').hide();
            });
        };

        //Save a ToDo edition
        $scope.saveToDo = function(todo, index){
            $scope.editingData[todo._id] = false;
            toDoService.saveToDo(todo, function(){
                toDoService.getAll(function(data){
                    $rootScope.toDos = data;
                    $scope.totalItems = $rootScope.toDos.length;
                    $('#toDoTableDiv').find('tr:nth-child('+(index+1)+')').find('.cancel-edit-col').hide();
                });
            });
        };

        //Pagination filter
        $scope.numPerPage = 5;
        $scope.paginate = function (todo) {
            var begin, end, index;
            begin = ($scope.currentPage - 1) * $scope.numPerPage;
            end = begin + $scope.numPerPage;
            index = $rootScope.toDos.indexOf(todo);
            return (begin <= index && index < end);
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
                    for (var i = 0, length =$rootScope.toDos.length; i < length; i++) {
                        $scope.editingData[$rootScope.toDos[i].id] = false;
                    }
                });
            }
        };
    });