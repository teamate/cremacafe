/**
 * Created by nadavbara on 12/06/2016.
 */
var mongoose = require('mongoose');
var Product = require('./product');

var Schema = mongoose.Schema;

var categories = new Schema({
    categoryName : String,
    categoryPriority: Number,
    products : [Product.schema],
    categoryPicture: String
});

module.exports = mongoose.model('Categories', categories);