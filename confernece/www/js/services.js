angular.module('AppServices', ['ngResource']).factory('Login', function () {
    var localStorage = window.localStorage;
    this.createUser = function (firstname, lastname) {
        localStorage.setItem("username", firstname + ' ' + lastname);
    }
    return this;
}).factory('Product', function ($http, Order) {
    var userProduct;
    this.getProduct = function (prod_name) {
        var product = $http.get(api_url + '/menu/products/' + prod_name);
        return product;
    };
    this.createUserProduct = function (prod_display_name, type, size, extras, spices, info, totalPrice, amount) {
        var parsed_info = ""
            , parsed_type, parsed_size, parsed_extras = ""
            , parsed_spices = "";
        if (type != null) {
            parsed_type = type.displayName;
            parsed_info += parsed_type + " ";
        }
        if (size != null) {
            parsed_size = size.name;
            parsed_info += " בגודל " + parsed_size + " ";
        }
        if (extras != null) {
            for (var i = 0; i < extras.length; i++) parsed_extras += extras[i].extraDisplayName + ", ";
            parsed_extras = parsed_extras.substring(0, parsed_extras.length - 2);
            if (extras.length) parsed_info += " בתוספת: " + parsed_extras;
        }
        if (spices != null) {
            parsed_spices = spices.join();
            if (parsed_spices.length) parsed_info += " ורטבים: " + parsed_spices;
        }
        userProduct = {
            "productName": prod_display_name
            , "productDetails": parsed_info
            , "productExtraInfo": info
            , "productAmount": amount
            , "productPrice": totalPrice
        };
    };
    this.addProductToOrder = function () {
        Order.WriteToStorage(userProduct);
        userProduct = {};
        return 1;
    };
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
                    var errorCallback = function () {}
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
            var temp = [];
            var res = JSON.parse(localStorage.getItem("order"));
            if (res != null) temp = res;
            temp.push(data);
            localStorage.setItem("order", JSON.stringify(temp));
            //            window.localStorage.clear();
        });
    }
    this.ReadFromStorage = function () {
        var result = [];
        $ionicPlatform.ready(function () {
            result = JSON.parse(localStorage.getItem("order"));
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
            localStorage.setItem("order", JSON.stringify(result));
        })
    }
    this.getOrderLength = function () {
        var length = 0;
        var result;
        if ((result = JSON.parse(localStorage.getItem("order"))) != null) length = result.length;
        return length;
    }
    this.processOrder = function (idToken, phoneNumber, orderProducts, orderNotes, timeForPickup, totalAmount) {
        var date = new Date();
        var total_order = {
            'userName': window.localStorage.getItem('username')
            , 'phoneNumber': phoneNumber
            , 'orderProducts': orderProducts
            , 'orderNotes': orderNotes
            , 'timeForPickup': timeForPickup
            , 'totalAmount': totalAmount
            , 'orderDate': date.toLocaleDateString()
            , 'orderTime': date.toLocaleTimeString()
        }
        var req = {
            method: 'POST'
            , url: api_url + "/orders"
            , headers: {
                'Content-Type': 'application/json'
                , 'Authorization': 'Bearer ' + idToken
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
        return $http.get(api_url + "/menu/categories");
    }
    return this;
}).factory('MyFavorites', function () {
    this.getMyFavoriets = function (user) {
        var result = HttpReqs.GetRequest("#", user);
        return result;
    }
});