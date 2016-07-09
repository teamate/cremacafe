angular.module('AppServices', ['ngResource']).factory('HttpReqs', function ($http) {
    this.ParseGetParams = function (params) {
        var result = '';
        if (params != '') {
            var result = '?';
            for (var key in params) {
                result += key + '=';
                result += params[key] + '&';
            }
            result = result.substring(0, substring.length - 1);
        }
        return result;
    }
    this.GetRequest = function (path, params) {
        var parsed_params = this.ParseGetParams(params);
        $http({
            method: 'GET'
            , url: path + '/' + parsed_params
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {
            return response;
        });
    }
    this.PostRequest = function (path, myData) {
        $http({
            method: 'POST'
            , url: path
            , headers: {
                'Content-Type': 'application/json'
            }
            , data: myData
        }).then(function successCallback(response) {
            //TODO
        }, function errorCallback(response) {
            //TODO 
        });
    }
    return this
}).factory('Coffee', function (Order) {
    var userCoffee = {};
    this.getCoffeeSizes = function () {
        var coffee_sizes = [{
            value: "0"
            , name: "גדול"
            , price: 5
        }, {
            value: "1"
            , name: "קטן"
            , price: 7
        }, {
            value: "2"
            , name: "בינוני"
            , price: 9
        }];
        return coffee_sizes;
    }
    this.getCoffeeTypes = function () {
        var coffee_types = [{
            value: "0"
            , name: "הפוך"
            , checked: true
            , price: 0
        }, {
            value: "1"
            , name: "שחור"
            , checked: false
            , price: 0
        }, {
            value: "2"
            , name: "תה"
            , checked: false
            , price: 0
        }, {
            value: "3"
            , name: "שוקו"
            , checked: false
            , price: 0
        }];
        return coffee_types;
    }
    this.getMilkTypes = function () {
        var milk_types = [{
            value: "0"
            , name: "חלב 1%"
            , checked: true
            , price: 0
        }, {
            value: "1"
            , name: "חלב 2%"
            , checked: true
            , price: 0
        }, {
            value: "2"
            , name: "חלב 3%"
            , checked: true
            , price: 0
        }, {
            value: "3"
            , name: "חלב סויה"
            , checked: true
            , price: 0
        }];
        return milk_types
    }
    this.CreateCoffee = function (size, coffeeType, milkType, info, totalPrice) {
        userCoffee = {
            "name": "coffee"
            , "size": size
            , "coffeeType": coffeeType
            , "milkType": milkType
            , "info": info
            , "price": totalPrice
        };
    }
    this.AddToOrder = function () {
        //Here i need to use the order service in order to write in the order file
        Order.WriteToStorage(userCoffee);
        userCoffee = {};
        return 1;
    }
    return this;
}).factory('Sandwitch', function () {
    this.getSandwitchesMenu = function () {
        var result = HttpReqs.GetRequest("#");
        return result;
    }
}).factory('Tost', function ($http, Order) {
    var userTosts;
    this.getToast = function () {
        var toast = $http.get("http://192.168.0.33:5000/menu/products/toast");
        return toast;
    }
    this.CreateTost = function (extras, info, totalPrice) {
        console.log(extras, info, totalPrice);
        var parsed_extras = "";
        for (var i = 0; i < extras.length; i++) parsed_extras += extras[i].extraDisplayName + ", ";
        parsed_extras = parsed_extras.substring(0, parsed_extras.length - 2);
        if (extras.length) parsed_info = "בתוספת\n" + parsed_extras;
        else parsed_info = "ללא תוספות";
        console.log(parsed_info);
        userTosts = {
            "name": "טוסט"
            , "details": parsed_info
            , "extraInfo": info
            , "price": totalPrice
        };
    }
    this.AddToOrder = function () {
        //Here i need to use the order service in order to write in the order file
        Order.WriteToStorage(userTosts);
        userTosts = {};
        return 1;
    }
    return this;
}).factory('Order', function ($ionicPlatform, $cordovaSQLite) {
    var localStorage = window.localStorage;
    var self = this;
    this.WriteToStorage = function (data) {
        $ionicPlatform.ready(function () {
            console.log("data: ", data);
            var temp = [];
            var res = JSON.parse(localStorage.getItem("order"));
            console.log("res: " + res);
            if (res != null) temp = res;
            temp.push(data);
            console.log(temp);
            localStorage.setItem("order", JSON.stringify(temp));
            //            window.localStorage.clear();
        });
    }
    this.ReadFromStorage = function () {
        var result = [];
        $ionicPlatform.ready(function () {
            result = JSON.parse(localStorage.getItem("order"));
            console.log(result);
        });
        return result;
    }
    this.ClearLocalStorage = function () {
        $ionicPlatform.ready(function () {
            localStorage.clear();
        });
    }
    this.RemoveItem = function (index) {
        $ionicPlatform.ready(function () {
            var result = JSON.parse(localStorage.getItem("order"));
            result.splice(index, 1);
            //self.ClearLocalStorage();
            localStorage.setItem("order", JSON.stringify(result));
        })
    }
    this.getOrderLength = function () {
        var length = 0;
        var result;
        if ((result = JSON.parse(localStorage.getItem("order"))) != null) length = result.length;
        console.log("order length is:" + length);
        return length;
    }
    return this;
}).factory('Categories', function ($http) {
    this.getCategories = function () {
        return $http.get("http://192.168.0.33:5000/menu/categories");
    }
    return this;
}).factory('MyFavorites', function () {
    this.getMyFavoriets = function (user) {
        var result = HttpReqs.GetRequest("#", user);
        return result;
    }
});