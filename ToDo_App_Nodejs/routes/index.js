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
router.get('/todos/:tag/:query', function(req, res, next) {

  var cb = function (err, todos) {
    if (err) {
      return next(err);
    }

    res.json(todos);
  };

  var q = req.params.query;

  switch (req.params.tag) {
    case 'description':
      ToDo.find({task: q}, cb);
      break;
    case 'context':
      ToDo.find({context: q}, cb);
      break;
    case 'project':
      ToDo.find({project: q}, cb);
      break;
    case 'priority':
      ToDo.find({priority: q}, cb);
  }
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
