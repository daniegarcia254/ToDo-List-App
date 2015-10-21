/**
 * Created by Daniel on 10/10/2015.
 */
angular.module('toDoApp')

    .service('toDoService', function ($http, APP_CONSTANTS) {

            return({
                getAll: getAll,
                getFilteredToDos: getFilteredToDos,
                getFilteredToDosByPriority: getFilteredToDosByPriority,
                removeToDo: removeToDo,
                removeToDos: removeToDos,
                createToDo: createToDo,
                saveToDo: saveToDo,
                saveToDoEditingStatus: saveToDoEditingStatus
            });

            function getAll(cb) {
                return $http.get(APP_CONSTANTS.API_URI).success(cb);
            }

            function getFilteredToDos(query, cb) {
                return $http.get(APP_CONSTANTS.API_URI+"/"+query).success(cb);
            }

            function getFilteredToDosByPriority(priority, cb) {
                return $http.get(APP_CONSTANTS.API_URI+'/priority/'+priority).success(cb);
            }

            function removeToDo(todo, cb) {
                return $http.post(APP_CONSTANTS.API_URI+"/remove", todo)
                    .success(cb)
                    .error(function(error){
                        console.log(error);
                    });
            }

            function removeToDos(selector, query, cb) {
                return $http.post(APP_CONSTANTS.API_URI+"/removeMultiple/"+selector+"/"+query.toString())
                    .success(cb)
                    .error(function(error){
                        console.log(error);
                    });
            }

            function createToDo(todo, cb) {
                return $http.post(APP_CONSTANTS.API_URI, todo).success(cb);
            }

            function saveToDo(todo,cb) {
                return $http.put(APP_CONSTANTS.API_URI, todo)
                    .success(cb)
                    .error(function(error){
                        console.log(error);
                    });
            }

            function saveToDoEditingStatus(todo,cb) {
                return $http.put(APP_CONSTANTS.API_URI+"/editingStatus", todo)
                    .success(cb)
                    .error(function(error){
                        console.log(error);
                    });
            }
    });