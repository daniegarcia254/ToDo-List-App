var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var todo = mongoose.model('ToDo');

/* GET all ToDos. */
router.get('/todos', function(req, res, next) {
  todo.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

/* POST --> create a new ToDo */
router.post('/todos', function(req, res, next) {

  var post = new todo(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

//GET home page
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
