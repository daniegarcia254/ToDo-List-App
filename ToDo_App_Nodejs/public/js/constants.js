/**
 * Created by Daniel on 10/10/2015.
 */
angular.module('toDoApp')

    .constant('APP_CONSTANTS', {
        "API_URI" : "http://localhost:3000/todos",
        "fields": [{
            name: "Task Description",
            tag: "description"
        }, {
            name: "Task Date",
            tag: "date"
        }, {
            name: "Task Status",
            tag: "status"
        }, {
            name: "Priority(1-10)",
            tag: "priority"
        }]
    });