/**
 * Created by Daniel on 10/10/2015.
 */
angular.module('toDoApp')

/**********************************************************************
 * removeToDosFormCtrl: Controller for the "Remove ToDo's" form
 ***********************************************************************/

    .controller('removeToDosFormCtrl', function($scope, $rootScope, $http, toDoService, $timeout, APP_CONSTANTS){

        $scope.selectors = APP_CONSTANTS.fields;
        $scope.taskField = false;
        $scope.dateField = false;
        $scope.statusField = false;
        $scope.priorityField = false;

        //Show & hide the form
        $rootScope.removeTodoFormShow = false;
        $scope.closeRemoveToDoForm = function(){
            $rootScope.removeTodoFormShow = !$rootScope.removeTodoFormShow;
            $scope.selector = undefined;
            $scope.query = "";
        };

        //Initiate the form remove input with Task Description input
        if (typeof $scope.selector === 'undefined') {
            $rootScope.hideRemoveFormDateInput = $rootScope.hideRemoveFormStatusInput =
                $rootScope.hideRemoveFormPriorityInput = $rootScope.showRemoveFormTaskInput = true;
        }

        //Function for remove in the DB the ToDo's that match the user input query
        $scope.removeToDos = function() {
            toDoService.removeToDos($scope.selector.tag, $scope.query, function() {
                //Get the complete list of ToDo's after removing
                toDoService.getAll(function(data){
                    $scope.closeRemoveToDoForm();
                    $timeout(function(){
                        $scope.checkRemoveInputType();
                        $scope.checkEnableRemoveFormSubmitButton();
                    }, 1000);
                    //Show the data on the screen
                    $rootScope.toDos = data;
                    $rootScope.errorMessage = "";
                });
            });
        };

        $rootScope.submitRemoveDisabled = true;
        //Function that handles if the submit button is enabled
        $scope.checkEnableRemoveFormSubmitButton = function(){
            if (typeof $scope.selector == 'undefined') {
                $rootScope.submitRemoveDisabled = true;
            } else {
                $rootScope.submitRemoveDisabled = !(typeof $scope.query != 'undefined' && $scope.query.length > 0);
            }
        };

        //Function that handles the formulary input element change of type
        $scope.checkRemoveInputType = function() {
            var $parent = $('#removeToDoFormField');
            var $div = null;
            if (typeof $scope.selector == 'undefined') {
            } else {

                if ($scope.taskField || $scope.dateField || $scope.statusField || $scope.priorityField) {
                    $parent.find('> .ng-scope').remove();
                    $scope.query = '';
                    $scope.checkEnableRemoveFormSubmitButton();
                }

                $scope.taskField = $scope.dateField = $scope.statusField = $scope.priorityField = false;

                switch ($scope.selector.tag) {
                    case 'description':
                        $div = $('<todo-remove-form-task-field></todo-remove-form-task-field>');
                        $scope.taskField = true;
                        break;
                    case 'date':
                        $div = $('<todo-remove-form-date-field></todo-remove-form-date-field>');
                        $scope.dateField = true;
                        break;
                    case 'status':
                        $div = $('<todo-remove-form-status-field></todo-remove-form-status-field>');
                        $scope.statusField = true;
                        break;
                    case 'priority':
                        $div = $('<todo-remove-form-priority-field></todo-remove-form-priority-field>');
                        $scope.priorityField = true;
                        break;
                }
                setTimeout(function () {
                    angular.element($parent).injector().invoke(function ($compile) {
                        var $parentScope = angular.element($parent).scope();
                        $parent.append($compile($div)($parentScope));
                        $parentScope.$apply();
                    });
                }, 100);
            }
        };
    });