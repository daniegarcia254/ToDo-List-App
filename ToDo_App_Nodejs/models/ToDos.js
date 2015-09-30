/**
 * Created by Daniel on 07/02/2015.
 */

var mongoose = require('mongoose');

var ToDoSchema = new mongoose.Schema({
    task: String,
    date: Date,
    status: String,
    priority: Number,
    editing: Boolean
});

mongoose.model('ToDo', ToDoSchema);