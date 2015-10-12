// Karma configuration
// Generated on Fri Oct 09 2015 00:00:27 GMT+0200 (Hora de verano romance)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'public/lib/angular/angular.js',
      'public/lib/angular/angular-mocks.js',
      'public/lib/angular/angular-animate.js',
      'public/lib/angular/angular-resource.js',
      'public/lib/angular/angular-route.js',
      'public/lib/angular/angular-sanitize.js',
      'public/lib/jquery-2.1.4.js',
      'public/lib/bootstrap/js/bootstrap.js',
      'public/lib/ui-bootstrap-tpls-0.11.0.js', 
      'public/js/angularApp.js', 
      'public/js/services/toDoService.js', 
      'public/js/controllers/mainCtrl.js', 
      'public/js/controllers/actionButtonsCtrl.js', 
      'public/js/controllers/addToDoFormCtrl.js', 
      'public/js/controllers/removeToDosFormCtrl.js', 
      'public/js/controllers/toDosTableCtrl.js',
      'public/js/directives/todosTable.js', 
      'public/js/directives/todoAddForm.js', 
      'public/js/directives/todoRemoveForm.js', 
      'public/js/directives/todoRemoveFormTaskField.js', 
      'public/js/directives/todoRemoveFormDateField.js', 
      'public/js/directives/todoRemoveFormStatusField.js', 
      'public/js/directives/todoRemoveFormPriorityField.js', 
      'public/js/constants.js',

      'tests/jasmine/basic-specs.js'
    ],


    // list of files to exclude
    exclude: [
        'app.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // optionally, configure the reporter
    coverageReporter: {
      dir : 'coverage/'
    },


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
        //'Chrome', 
        'PhantomJS'
    ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
}
