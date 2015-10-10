/**
 * Created by Daniel on 10/10/2015.
 */

//Directive for show a table with ToDo's
angular.module('toDoApp').

    directive('todosTable', function() {
        return {
            restrict: 'E',
            templateUrl: '/templates/toDo_table.html'
        };
    });