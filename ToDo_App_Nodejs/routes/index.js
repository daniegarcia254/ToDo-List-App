var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var ToDo = mongoose.model('ToDo');

/* GET all ToDos. */
router.get('/todos', function(req, res, next) {
  ToDo.find(function(err, todos){
    if(err){ return next(err); }

    res.json(todos);
  });
});

/* GET the ToDos that matches [query] in the [tag] field. */
router.get('/todos/:query', function(req, res, next) {

  var q = req.params.query;
  ToDo.find({$or : [{task: q}, {context: q}, {project: q}]},
      function (err, todos) {
        if (err) {
          console.log(err);
          return next(err);
        }
        res.json(todos);
      });
});

/* GET the ToDos that matches a given priority */
router.get('/todos/priority/:query', function(req, res, next) {

  var p = parseInt(req.params.query);
  ToDo.find({priority: p},function(err, todos){
    if(err){ return next(err); }

    res.json(todos);
  });
});

/* POST --> create a new ToDo */
router.post('/todos', function(req, res, next) {

  var todo = new ToDo(req.body);

  todo.save(function(err, todo){
    if(err){ return next(err); }

    res.json(todo);
  });
});



/* DELETE --> Delete a ToDo */
router.post('/todos/remove', function(req, res, next) {

  var todo = new ToDo(req.body);

  todo.remove(function(err, todo){
    if(err){return err; }

    res.json(todo);
  });
});


//GET home page
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
