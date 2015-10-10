/**
 * Created by Daniel on 10/10/2015.
 */
angular.module('toDoApp').

    directive('todoAddForm', function() {
        return {
            restrict: 'E',
            templateUrl: '/templates/toDo_add_form.html'
        };
    });