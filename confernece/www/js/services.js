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
}).factory('Coffee', function ($http, Order) {
    var userCoffee;
    this.getCoffee = function () {
        //var coffee = $http.get("http://192.168.43.80:5000/menu/products/coffee");
        var coffee = $http.get(api_url + "/menu/products/coffee");
        return coffee;
    }
    this.CreateCoffee = function (type, size, info, totalPrice) {
        var parsed_info = type.displayName + " בגודל " + size.name;
        userCoffee = {
            "productName": "קפה"
            , "productDetails": parsed_info
            , "productExtraInfo": info
            , "productPrice": totalPrice
        };
    }
    this.AddToOrder = function () {
        //Here i need to use the order service in order to write in the order file
        Order.WriteToStorage(userCoffee);
        userCoffee = {};
        return 1;
    }
    return this;
}).factory('Tost', function ($http, Order) {
    var userTosts;
    this.getToast = function () {
        //var toast = $http.get("http://192.168.0.33:5000/menu/products/toast");
        //var toast = $http.get("http://192.168.43.80:5000/menu/products/toast");
        var toast = $http.get(api_url + "/menu/products/toast");
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
            "productName": "טוסט"
            , "productDetails": parsed_info
            , "productExtraInfo": info
            , "productPrice": totalPrice
        };
    }
    this.AddToOrder = function () {
        //Here i need to use the order service in order to write in the order file
        Order.WriteToStorage(userTosts);
        userTosts = {};
        return 1;
    }
    return this;
}).factory('Sandwitch', function ($http, Order) {
    var userSandwitch;
    this.getSandwitch = function () {
        //var sandwitch = $http.get("http://192.168.0.33:5000/menu/products/sandwitch");
        //var sandwitch = $http.get("http://192.168.43.80:5000/menu/products/sandwitch");
        var sandwitch = $http.get(api_url + "/menu/products/sandwiches");
        return sandwitch;
    }
    this.CreateSandwitch = function (type, extras, info, totalPrice) {
        parsed_type = type.displayName + "\n";
        var parsed_extras = "";
        for (var i = 0; i < extras.length; i++) parsed_extras += extras[i].extraDisplayName + ", ";
        parsed_extras = parsed_extras.substring(0, parsed_extras.length - 2);
        if (extras.length) parsed_info = parsed_type + "בתוספת\n" + parsed_extras;
        else parsed_info = parsed_type + "ללא תוספות";
        userSandwitch = {
            "productName": "סנדוויץ'"
            , "productDetails": parsed_info
            , "productExtraInfo": info
            , "productPrice": totalPrice
        };
    }
    this.AddToOrder = function () {
        //Here i need to use the order service in order to write in the order file
        Order.WriteToStorage(userSandwitch);
        userSandwitch = {};
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
        //return $http.get("http://192.168.0.33:5000/menu/categories");
        //return $http.get("http://192.168.43.80:5000/menu/categories");
        return $http.get(api_url + "/menu/categories");
    }
    return this;
}).factory('MyFavorites', function () {
    this.getMyFavoriets = function (user) {
        var result = HttpReqs.GetRequest("#", user);
        return result;
    }
});