use crema_test_db
//inserting to coffee category
var coffeeCategoryID = db.categories.findOne({categoryName:"coffee"})._id;
db.products.insert([

    {
        productName: "coffee",
        type:true,
        types:[
        {
            productName: "miracleOnMilk",
            displayName: "נס על חלב",
            size: true,
            sizes:[
                {name: "קטן",price: 3},
                {name: "בינוני",price: 5},
                {name: "גדול",price: 7}
            ],
        },
        {
            productName: "Hafooch",
            displayName: "הפוך",
            size: true,
            sizes:[
                {name: "קטן",price: 3},
                {name: "בינוני",price: 5},
                {name: "גדול",price: 7}
            ],
        },
        {
            productName: "black",
            displayName: "שחור",
            size: true,
            sizes:[
                {name: "קטן",price: 3},
                {name: "בינוני",price: 5},
                {name: "גדול",price: 7}
            ],
        }
        ],
        
        extra: false,
        productPicture: "http://www.ynet.co.il/PicServer2/28102008/1733298/untitled2_wa.jpg",
        category_id: coffeeCategoryID
    }
    

]);

//inserting to sandwiches category
var sandwichesCategoryID = db.categories.findOne({categoryName:"sandwiches"})._id;
db.products.insert([

    {
        productName: "sandwiches",
        type:true,
        types:[
        {
            productName: "Tuna",
            displayName: "כריך טונה",
            productPrice: "12",
            size:false
        },
        {
            productName: "havita",
            displayName: "כריך חביתה",
            productPrice: "12",
            size:false

        },
        {
            productName: "bulgarit",
            displayName: "כריך בולגרית",
            productPrice: "12",
            size:false

        },
        {
            productName: "yellow",
            displayName: "כריך צהובה",
            productPrice: "12",
            size:false
            
        },
        ],
        extra: true,
        extras: [{
                extraName:"drink",
                extraDisplayName:"שתייה",
                extraPrice: 3,
                checked: false
            },
            {
                extraName:"olives",
                extraDisplayName:"זיתים",
                extraPrice: 0.5,
                checked: false
            },
            {
                extraName:"tuna",
                extraDisplayName:"טונה",
                extraPrice: 2,
                checked: false
            },
            {
                extraName:"egg",
                extraDisplayName:"ביצה",
                extraPrice: 2,
                checked: false
            }

        ],
        productPicture: "http://images5.webydo.com/90/9001181/3958/9a72120d-4bbc-4a26-8186-3a946f99d242.jpg",
        category_id: sandwichesCategoryID

    }
    

]);
var toastsCategoryID = db.categories.findOne({categoryName:"toast"})._id;
db.products.insert([
    {
        productName: "toast",
        displayName: "טוסט",
        productPrice: "15",
        type:false,
        extra: true,
        extras: [
            {
                extraName:"drink",
                extraDisplayName:"שתייה",
                extraPrice: 2,
                checked: false
            },
            {
                extraName:"olives",
                extraDisplayName:"זיתים",
                extraPrice: 0,
                checked: false
            },
            {
                extraName:"tuna",
                extraDisplayName:"טונה",
                extraPrice: 2,
                checked: false
            },
            {
                extraName:"egg",
                extraDisplayName:"ביצה",
                extraPrice: 2,
                checked: false
            }

        ],
        productPicture: "http://www.ppa.co.il/public/uploads/menus/bigel_tost2.jpg",
        category_id: toastsCategoryID
    }
]);

var burekasCategoryID = db.categories.findOne({categoryName:"burekas"})._id;
db.products.insert([
    {
        productName: "burekas",
        displayName: "בורקס",
        productPrice: "8",
        type:false,
        extra: true,
        extras: [
            {
                extraName:"coffee",
                extraDisplayName:"קפה",
                extraPrice: 2,
                checked: false
            }
        ],
        productPicture: "http://images.mysupermarket.co.il/ProductsDetailed/15/020315.jpg",
        category_id: burekasCategoryID
    }
]);

var shakshukaCategoryID = db.categories.findOne({categoryName:"shakshuka"})._id;
db.products.insert([
    {
        productName: "shakshuka",
        displayName: "שקשוקה",
        productPrice: "17",
        type:false,
        extra: true,
        extras: [
            {
                extraName:"drink",
                extraDisplayName:"שתייה",
                extraPrice: 3,
                checked: false
            }
        ],
        productPicture: "http://img.mako.co.il/2010/07/21/shakshuka_c.jpg",
        category_id: shakshukaCategoryID
    }
]);
var salesCategoryID = db.categories.findOne({categoryName:"sales"})._id;
db.products.insert([
    {
        productName: "coffeeAndBaker",
        displayName: "קפה ומאפה",
        productPrice: "8",
        type:false,
        extra: false,
        extras: [],
        productPicture: "https://img.grouponcdn.com/deal/n48qAfbWVy67vYHPyeHB6z/_-700x420",
        category_id: salesCategoryID
    }
]);








