var mongoose = require('mongoose');
var Category = require('./categories')

var Schema = mongoose.Schema;

// create a schema
var menu = new Schema({
  name: String,
  categories : [Category.schema]
});

// make this available to our users in our Node applications
module.exports = mongoose.model('Menu', menu);