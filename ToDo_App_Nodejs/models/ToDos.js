/**
 * Created by Daniel on 07/02/2015.
 */

var mongoose = require('mongoose');

var ToDoSchema = new mongoose.Schema({
    task: String,
    context: String,
    project: String,
    priority: Number
});

mongoose.model('ToDo', ToDoSchema);