use crema_test_db
//inserting to coffee category
var coffeeCategoryID = db.categories.findOne({categoryName:"coffee"})._id;
db.products.insert([
    {
        productName: "miracleOnMilk",
        displayName: "נס על חלב",
        productPrice: "5",
        extra: false,
        extras: [],
        productPicture: "http://www.ynet.co.il/PicServer2/28102008/1733298/untitled2_wa.jpg",
        category_id: coffeeCategoryID
    },
    {
        productName: "Hafooch",
        displayName: "הפוך",
        productPrice: "3",
        extra: false,
        extras: [],
        productPicture: "http://img.mako.co.il/2012/11/05/coffee_iStock_000021214508Small_c.jpg",
        category_id: coffeeCategoryID
    },
    {
        productName: "black",
        displayName: "שחור",
        productPrice: "3",
        extra: false,
        extras: [],
        productPicture: "http://media.shvoong.co.il/App_Themes/he-IL/Upload/Content/Catavot_2014/2014_17/19198.2.jpg",
        category_id: coffeeCategoryID
    }

]);

//inserting to sandwiches category
var sandwichesCategoryID = db.categories.findOne({categoryName:"sandwiches"})._id;
db.products.insert([
    {
        productName: "Tuna",
        displayName: "כריך טונה",
        productPrice: "12",
        extra: true,
        extras: [{
                extraName:"drink",
                extraDisplayName:"שתייה",
                extraPrice: 3
            },
            {
                extraName:"olives",
                extraDisplayName:"זיתים",
                extraPrice: 0.5
            },
            {
                extraName:"tuna",
                extraDisplayName:"טונה",
                extraPrice: 2
            },
            {
                extraName:"egg",
                extraDisplayName:"ביצה",
                extraPrice: 2
            }

        ],
        productPicture: "http://images5.webydo.com/90/9001181/3958/9a72120d-4bbc-4a26-8186-3a946f99d242.jpg",
        category_id: sandwichesCategoryID
    },
    {
        productName: "havita",
        displayName: "כריך חביתה",
        productPrice: "12",
        extra: true,
        extras: [
            {
                extraName:"drink",
                extraDisplayName:"שתייה",
                extraPrice: 3
            },
            {
                extraName:"olives",
                extraDisplayName:"זיתים",
                extraPrice: 0.5
            },
            {
                extraName:"tuna",
                extraDisplayName:"טונה",
                extraPrice: 2
            },
            {
                extraName:"egg",
                extraDisplayName:"ביצה",
                extraPrice: 2
            }

        ],
        productPicture: "http://images5.webydo.com/90/9001181/3958/bb2f1cab-1767-411a-b911-63fbd5f5e793.jpg",
        category_id: sandwichesCategoryID
    },
    {
        productName: "bulgarit",
        displayName: "כריך בולגרית",
        productPrice: "12",
        extra: true,
        extras: [
            {
                extraName:"drink",
                extraDisplayName:"שתייה",
                extraPrice: 3
            },
            {
                extraName:"olives",
                extraDisplayName:"זיתים",
                extraPrice: 0.5
            },
            {
                extraName:"tuna",
                extraDisplayName:"טונה",
                extraPrice: 2
            },
            {
                extraName:"egg",
                extraDisplayName:"ביצה",
                extraPrice: 2
            }

        ],
        productPicture: "http://static.sbnxt.com/kir/b2s/x9u/exai.jpg",
        category_id: sandwichesCategoryID
    },
    {
        productName: "yellow",
        displayName: "כריך צהובה",
        productPrice: "12",
        extra: true,
        extras: [
            {
                extraName:"drink",
                extraDisplayName:"שתייה",
                extraPrice: 3
            },
            {
                extraName:"olives",
                extraDisplayName:"זיתים",
                extraPrice: 0.5
            },
            {
                extraName:"tuna",
                extraDisplayName:"טונה",
                extraPrice: 2
            },
            {
                extraName:"egg",
                extraDisplayName:"ביצה",
                extraPrice: 2
            }

        ],
        productPicture: "https://www.mishloha.co.il/files/menu_food_pic/1811201321415462.jpg",
        category_id: sandwichesCategoryID
    }

]);
var toastsCategoryID = db.categories.findOne({categoryName:"toast"})._id;
db.products.insert([
    {
        productName: "toast",
        displayName: "טוסט",
        productPrice: "15",
        extra: true,
        extras: [
            {
                extraName:"drink",
                extraDisplayName:"שתייה",
                extraPrice: 2
            },
            {
                extraName:"olives",
                extraDisplayName:"זיתים",
                extraPrice: 0
            },
            {
                extraName:"tuna",
                extraDisplayName:"טונה",
                extraPrice: 2
            },
            {
                extraName:"egg",
                extraDisplayName:"ביצה",
                extraPrice: 2
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
        extra: true,
        extras: [
            {
                extraName:"coffee",
                extraDisplayName:"קפה",
                extraPrice: 2
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
        extra: true,
        extras: [
            {
                extraName:"drink",
                extraDisplayName:"שתייה",
                extraPrice: 3
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
        extra: false,
        extras: [],
        productPicture: "https://img.grouponcdn.com/deal/n48qAfbWVy67vYHPyeHB6z/_-700x420",
        category_id: salesCategoryID
    }
]);








