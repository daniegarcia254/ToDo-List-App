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

router.post('/todos', function(req, res, next) {
  var post = new ToDo(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

//GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
