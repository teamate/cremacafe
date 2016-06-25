var express = require('express'),
	morgan = require('morgan'),
    mongodb = require('mongodb').MongoClient,
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    menu        = require('./routes/menu'),
    mongoose        = require('mongoose'),
    Category        = require('./models/categories'),
    Product        = require('./models/product'),
    app = express();

//var url = 'mongodb://baza:bgu4life@ds013414.mlab.com:13414/crema_cafe_db';
var url = 'mongodb://localhost:27017/crema_test_db';
// mongoose.connect(url);
/*var db = mongodb.connect(url,function (err, db) {
    console.log("connected to db");
    return db;
});*/


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride());      // simulate DELETE and PUT

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});



app.use('/', menu);
//app.get('/sessions/:id', sessions.findById);

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
