var express = require('express'),
	morgan = require('morgan'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    sessions        = require('./routes/sessions'),
    mongoose        = require('mongoose'),
    Menu            = require('./models/menu')
    app = express();


mongoose.connect('mongodb://baza:bgu4life@ds013414.mlab.com:13414/crema_cafe_db');

var resturantMenu = new Menu({
    name:'chris',
    username: 'nadavbara',
    password: '1234'
});


resturantMenu.save(function (err) {
    if(err){console.log(err)};
    console.log('something worked');
})

/*
Menu.find({}, function(err, users) {
    if (err) throw err;

    // object of all the users
    console.log(users);
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

app.get('/sessions', sessions.findAll);
app.get('/sessions/:id', sessions.findById);

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
