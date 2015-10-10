/**
 * Created by Daniel on 10/10/2015.
 */
angular.module('toDoApp')

    .service('toDoService', function ($http, APP_CONSTANTS) {

            var t = {
                todos: []
            };

            t.getAll = function(cb) {
                return $http.get(APP_CONSTANTS.API_URI).success(cb);
            };

            t.getFilteredToDos = function(query, cb) {
                return $http.get(APP_CONSTANTS.API_URI+"/"+query).success(cb);
            };

            t.getFilteredToDosByPriority = function(priority, cb) {
                return $http.get(APP_CONSTANTS.API_URI+'/priority/'+priority).success(cb);
            };

            t.removeToDo = function(todo, cb) {
                return $http.post(APP_CONSTANTS.API_URI+"/remove", todo)
                    .success(cb)
                    .error(function(error){
                        console.log(error);
                    });
            };

            t.removeToDos = function(selector, query, cb) {
                return $http.post(APP_CONSTANTS.API_URI+"/removeMultiple/"+selector+"/"+query.toString())
                    .success(cb)
                    .error(function(error){
                        console.log(error);
                    });
            };

            t.createToDo = function(todo, cb) {
                return $http.post(APP_CONSTANTS.API_URI, todo).success(cb);
            };

            t.saveToDo = function(todo,cb) {
                return $http.put(APP_CONSTANTS.API_URI, todo)
                    .success(cb)
                    .error(function(error){
                        console.log(error);
                    });
            }


            return t;
    });