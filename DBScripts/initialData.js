use crema_test_db
db.menu.insert(
{
	menuName: "ordersMenu",
	categories:[
	{
		categoryName: "coffee",
    	categoryPriority: 1,
    	categoryPicture: "http://torino-aldo.co.il/upload_pics/Image/0009990.jpg",
    	products :[
    	{
    		productName : "Hafoch",
    		productPrice : "5",
    		extra: false,
    		extras : [],
    		productPicture: "http://img.mako.co.il/2012/11/05/coffee_iStock_000021214508Small_c.jpg"
   		},
   		{
    		productName : "MiracleOnMilk",
    		productPrice : "3",
    		extra: false,
    		extras : [],
    		productPicture: "http://img.mako.co.il/2012/11/05/coffee_iStock_000021214508Small_c.jpg"
   		}
   		]
	},
	{
		categoryName:"sandwiches",
		categoryPriority: 2,
		categoryPicture: "http://torino-aldo.co.il/upload_pics/Image/0009990.jpg",
		products:[
		{
    		productName : "Tuna",
    		productPrice : "5",
    		extra: true,
    		extras : ["olives,tomatos,mashrums"],
    		productPicture: "http://img.mako.co.il/2012/11/05/coffee_iStock_000021214508Small_c.jpg"
   		}]
		
		
	}]

});

db.menu.find({"categories.0.categoryName":"coffee"},{"categories.categoryName":1})

//embbedded is very hard to query on, maybe i shuld switch to 
