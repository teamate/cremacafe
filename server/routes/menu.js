var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var dbConnection = require('../dbConnections/mongoDbconnection')

router.get('/categories', function (req, res) {
    console.log('got here');
    var db = dbConnection.get();
    var collection = db.collection('categories');
    collection.find().toArray(function (err, docs) {
        res.send(docs);
    })
});
/*
router.get('/categories/:category_id', function (req, res) {
    var db = dbConnection.get();
    var collection = db.collection('categories');
    var id = req.params.category_id;
    var mongo_id = new mongo.ObjectID(id);
    var category = collection.findOne({_id:mongo_id}, function (err, category) {
        res.send(category);
    })

})*/

router.get('/categories/:category_name', function (req, res) {
    var db = dbConnection.get();
    var collection = db.collection('categories');
    var name = req.params.category_name;
    var category = collection.findOne({categoryName:name}, function (err, category) {
        res.send(category);
    })

})

router.get('/categories/:category_id/products', function (req, res) {
    var db = dbConnection.get();
    var collection = db.collection('products');
    var mongo_id = new mongo.ObjectID(req.params.category_id);
    var category = collection.find({category_id:mongo_id}).toArray(function (err, category) {
        res.send(category);
    })

})

router.get('/products', function (req, res) {
    var db = dbConnection.get();
    var collection = db.collection('products');
    collection.find().toArray(function (err, docs) {
        res.send(docs);
    })
});

router.get('/products/:product_name', function (req, res) {
    var db = dbConnection.get();
    var collection = db.collection('products');
    var product_name = req.params.product_name;
    var category = collection.findOne({productName:product_name}, function (err, products) {
        res.send(products);
    })
});


module.exports = router;

