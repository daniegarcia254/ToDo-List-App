/**
 * Created by Daniel on 12/10/2015.
 */
angular.module('toDoApp')
    .directive('dateFormatter', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelController) {
                ngModelController.$parsers.push(function(data) {
                    //convert data from view format to model format
                    return data; //converted
                });

                ngModelController.$formatters.push(function(data) {
                    //convert data from model format to view format
                    return data.substring(0,data.length-2);
                });
            }
        }
    });