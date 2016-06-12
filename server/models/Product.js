/**
 * Created by nadavbara on 12/06/2016.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var product = new Schema({
    productName : String,
    productPrice: Number,
    extra: Boolean,
    extras : [{
        extraName:String,
        extraPrice:Number
    }],
    productPictrue : String

});

module.exports = mongoose.model('Product', product);