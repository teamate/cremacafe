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
}).factory('Login', function () {
    var localStorage = window.localStorage;
    this.createUser = function (firstname, lastname) {
        console.log(firstname + ' ' + lastname);
        localStorage.setItem("username", firstname + ' ' + lastname);
    }
    return this;
}).factory('Coffee', function ($http, Order) {
    var userCoffee;
    this.getCoffee = function () {
        //var coffee = $http.get("http://192.168.43.80:5000/menu/products/coffee");
        var coffee = $http.get(api_url + "/menu/products/coffee");
        return coffee;
    }
    this.CreateCoffee = function (type, size, info, totalPrice, amount) {
        var parsed_info = type.displayName + " בגודל " + size.name;
        userCoffee = {
            "productName": "קפה"
            , "productDetails": parsed_info
            , "productExtraInfo": info
            , "productAmount": amount
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
    this.CreateTost = function (extras, info, totalPrice, amount) {
        console.log(extras, info, totalPrice);
        var parsed_extras = "";
        for (var i = 0; i < extras.length; i++) parsed_extras += extras[i].extraDisplayName + ", ";
        parsed_extras = parsed_extras.substring(0, parsed_extras.length - 2);
        if (extras.length) parsed_info = parsed_extras;
        else parsed_info = "";
        console.log(parsed_info);
        userTosts = {
            "productName": "טוסט"
            , "productDetails": parsed_info
            , "productExtraInfo": info
            , "productAmount": amount
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
}).factory('Shakshuka', function ($http, Order) {
    var userShakshuka;
    this.getShakshuka = function () {
        var shakshuka = $http.get(api_url + "/menu/products/shakshuka");
        return shakshuka;
    }
    this.createShakshuka = function (extras, info, totalPrice, amount) {
        console.log(extras, info, totalPrice);
        var parsed_extras = "";
        for (var i = 0; i < extras.length; i++) parsed_extras += extras[i].extraDisplayName + ", ";
        parsed_extras = parsed_extras.substring(0, parsed_extras.length - 2);
        if (extras.length) parsed_info = parsed_extras;
        else parsed_info = "";
        console.log(parsed_info);
        userShakshuka = {
            "productName": "שקשוקה"
            , "productDetails": parsed_info
            , "productExtraInfo": info
            , "productAmount": amount
            , "productPrice": totalPrice
        };
    }
    this.AddToOrder = function () {
        //Here i need to use the order service in order to write in the order file
        Order.WriteToStorage(userShakshuka);
        userShakshuka = {};
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
    this.CreateSandwitch = function (type, extras, info, totalPrice, amount) {
        parsed_type = type.displayName;
        var parsed_extras = "";
        for (var i = 0; i < extras.length; i++) parsed_extras += extras[i].extraDisplayName + ", ";
        parsed_extras = parsed_extras.substring(0, parsed_extras.length - 2);
        if (extras.length) parsed_info = parsed_type + ", " + parsed_extras;
        else parsed_info = parsed_type;
        userSandwitch = {
            "productName": "כריך"
            , "productDetails": parsed_info
            , "productExtraInfo": info
            , "productAmount": amount
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
}).factory('Order', function ($ionicPlatform, $cordovaSQLite, $http) {
    var localStorage = window.localStorage;
    var auth0 = new Auth0({
        clientID: 'EgY7ZjhvdKrGc3r7X5k6DSXwZpczJIKL'
        , domain: 'cremacafe.auth0.com'
        , callbackURL: 'https://cremacafe.herokuapp.com/auth'
    });
    var self = this;
    this.getSmsPermissions = function () {
        $ionicPlatform.ready(function () {
            var permissions = cordova.plugins.permissions;
            permissions.hasPermission(permissions, checkPermissionCallback, null);

            function checkPermissionCallback(status) {
                if (!status.hasPermission) {
                    var errorCallback = function () {
                        console.log("error getting permissions");
                    }
                    permissions.requestPermission(permissions.READ_SMS, function (status) {
                        if (!status.hasPermission) errorCallback();
                    }, errorCallback);
                    permissions.requestPermission(permissions.RECEIVE_SMS, function (status) {
                        if (!status.hasPermission) errorCallback();
                    }, errorCallback);
                }
            };
        })
    }
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
    this.removeOrder = function () {
        $ionicPlatform.ready(function () {
            localStorage.removeItem("order");
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
    this.processOrder = function (idToken, phoneNumber, orderProducts, orderNotes, timeForPickup, totalAmount) {
        console.log(orderProducts);
        var date = new Date();
        var total_order = {
            'userName': window.localStorage.getItem('username')
            , 'phoneNumber': phoneNumber
            , 'orderProducts': orderProducts
            , 'orderNotes': orderNotes
            , 'timeForPickup': timeForPickup
            , 'totalAmount': totalAmount
            , 'orderDate': date.toLocaleDateString
            , 'orderTime': date.toLocaleTimeString
        }
        var req = {
            method: 'POST'
            , url: api_url + "/orders"
            , headers: {
                'Content-Type': 'application/json'
                , 'Authorization': 'Bearer ' + idToken
                    //                , 'Access-Control-Allow-Origin': '*'
                    //                , 'Access-Control-Allow-Credentials': 'true'
                    //                , 'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT'
                    //                , 'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
            }
            , data: total_order
        }
        return $http(req);
    }
    this.sendSms = function (phoneNumber) {
        console.log("phone:" + phoneNumber);
        var req = {
            method: 'POST'
            , url: api_url + '/auth/sendsms'
            , headers: {
                'Content-Type': 'application/json'
            }
            , data: {
                "phoneNumber": phoneNumber
            }
        }
        return $http(req);
    }
    this.login = function (phoneNumber, authToken) {
        console.log(authToken);
        var req = {
            method: 'POST'
            , url: api_url + '/auth/getcode'
            , headers: {
                'Content-Type': 'application/json'
            }
            , data: {
                "phoneNumber": phoneNumber
                , "passcode": authToken
            }
        }
        return $http(req);
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