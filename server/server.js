var express = require('express'),
	morgan = require('morgan'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    menu        = require('./routes/menu'),
    mongoose        = require('mongoose'),
    mongodb         = require('./dbConnections/mongoDbconnection')
    app = express();


//var url = 'mongodb://localhost:27017/crema_test_db';
var url = 'mongodb://baza:bgu4life@ds011715.mlab.com:11715/crema_test_db';
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



app.use('/menu', menu);

app.set('port', process.env.PORT || 5000);
mongodb.connect(url,function(err){
    if(err){
        console.log("failed connecting to db: " + url);
        process.exit(1);
    }else{
        app.listen(app.get('port'), function () {
            console.log('Express server listening on port ' + app.get('port'));
        });
    }
})

