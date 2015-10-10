/**
 * Created by Daniel on 10/10/2015.
 */
angular.module('toDoApp')

/**********************************************************************
 * mainCtrl: Controlador principal de la aplicación.
 ***********************************************************************/

    .controller('mainCtrl', function ($document, $rootScope, toDoService) {

        $rootScope.addTodoFormShow = $rootScope.removeTodoFormShow = false;

        $document.ready(function(){
            toDoService.getAll(function(data){
                $rootScope.toDos = data;
            });
        });
    });