var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/crema_test_db';

router.get('/menu',function (req, res) {
    mongodb.connect(url,function (err, db) {
        var collection = db.collection('categories');
        collection.find().toArray(function (err, documents) {
            res.send(documents);
        })
        

    });
});

module.exports = router;

