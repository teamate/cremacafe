use crema_test_db
var menuID = db.menus.findOne({menuName:"Orders Menu"})._id;
db.categories.insert(
    [
        {
            categoryName: "coffee",
            displayName: "קפה",
            categoryPriority: 1,
            categoryPicture: "http://torino-aldo.co.il/upload_pics/Image/0009990.jpg",
            menu_id: menuID
        },
        {
            categoryName:"sandwiches",
            displayName:"כריכים",
            categoryPriority: 2,
            categoryPicture: "http://www.superbis.co.il/wp-content/uploads/2015/04/%D7%9B%D7%A8%D7%99%D7%9B%D7%99%D7%9D-148282.jpg",
            menu_id: menuID
        },
        {
            categoryName: "shakshuka",
            displayName:"שקשוקה",
            categoryPriority: 3,
            categoryPicture: "http://img.mako.co.il/2010/07/21/shakshuka_c.jpg",
            menu_id: menuID
        },
        {
            categoryName: "toast",
            displayName:"טוסט",
            categoryPriority: 4,
            categoryPicture: "http://www.ppa.co.il/public/uploads/menus/bigel_tost2.jpg",
            menu_id: menuID
        },
        {
            categoryName: "burekas",
            displayName: "בורקס",
            categoryPriority: 5,
            categoryPicture: "http://images.mysupermarket.co.il/ProductsDetailed/15/020315.jpg",
            menu_id: menuID
        },
        {
            categoryName: "sales",
            displayName:"מבצעים",
            categoryPriority: 6,
            categoryPicture: "https://img.grouponcdn.com/deal/n48qAfbWVy67vYHPyeHB6z/_-700x420",
            menu_id: menuID
        }
        
        
    ]
)
