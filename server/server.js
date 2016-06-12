var express = require('express'),
	morgan = require('morgan'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    sessions        = require('./routes/sessions'),
    mongoose        = require('mongoose'),
    Menu            = require('./models/menu'),
    Category        = require('./models/categories'),
    Product        = require('./models/product'),
    app = express();


// mongoose.connect('mongodb://baza:bgu4life@ds013414.mlab.com:13414/crema_cafe_db');
mongoose.connect('mongodb://localhost:27017/crema_cafe_db');

var product = new Product({
    productName : "Hafoch",
    productPrice : "5",
    extra: false,
    extras : [],
    productPicture: "http://img.mako.co.il/2012/11/05/coffee_iStock_000021214508Small_c.jpg"

});

var category = new Category({
    categoryName: "coffee",
    categoryPriority: 1,
    products : [product],
    categoryPicture: "http://torino-aldo.co.il/upload_pics/Image/0009990.jpg"
});

var menu = new Menu({
    name: "regular",
    categories : [category]
});


var product2 = new Product({
    productName : "MiracleOnMilk",
    productPrice : "3",
    extra: false,
    extras : [],
    productPicture: "http://img.mako.co.il/2012/11/05/coffee_iStock_000021214508Small_c.jpg"
});





product.save(function (err) {
    if(err){
        console.log(err);
    }
    console.log("product saved");
});


product2.save(function (err) {
    if(err){
        console.log(err);
    }
    console.log("product saved");
});

category.save(function (err) {
    if(err){
        console.log(err);
    }
    console.log("category saved");
});

menu.save(function (err) {
    if(err){
        console.log(err);
    }
    console.log("menu saved")

}).then(function (err, menu) {
    Category.findOne({categoryName:"coffee"},function (err,category) {
        if(err){
            console.log(err);
        }
        //console.log(category.products);
        category.products.push(product2);
        category.save();
    })
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
