var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var ToDo = mongoose.model('ToDo');

/* GET all ToDos. */
router.get('/todos', function(req, res, next) {
  ToDo.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
