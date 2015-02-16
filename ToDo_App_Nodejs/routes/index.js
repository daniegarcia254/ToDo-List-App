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
  var regex = new RegExp(q,"i");
  ToDo.find({$or : [{task: regex}, {context: regex}, {project: regex}]},
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
router.post('/todos/remove', function(req, res) {

  var todo = new ToDo(req.body);

  todo.remove(function(err, todo){
    if(err){return err; }

    res.json(todo);
  });
});

/* DELETE --> Delete multiple ToDos that exactly match a string */
router.post('/todos/removeMultiple/:selector/:query', function(req, res) {

  var s = req.params.selector;
  var q = req.params.query;

  switch (s){
    case 'priority':
      q = parseInt(q);
      ToDo.remove({priority:q},function(err, msg){
        if (err) {return err;}
        res.json(msg);
      });
      break;
    case 'description':
      ToDo.remove({task:q},function(err, msg){
        if (err) {return err;}
        res.json(msg);
      });
      break;
    case 'context':
      break;
      ToDo.remove({context:q},function(err, msg){
        if (err) {return err;}
        res.json(msg);
      });
      break;
    case 'project':
      ToDo.remove({project:q},function(err, msg){
        if (err) {return err;}
        res.json(msg);
      });
      break;
  }
});


//GET home page
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
