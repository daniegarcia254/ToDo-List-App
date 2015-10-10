/**
 * Created by Daniel on 10/10/2015.
 */
angular.module('toDoApp').

    directive('todoRemoveFormDateField', function() {
        return {
            restrict: 'E',
            templateUrl: '/templates/toDo_remove_form_date_field.html'
        };
    });