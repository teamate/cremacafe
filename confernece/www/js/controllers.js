angular.module('starter.controllers', ['AppServices']).controller('AppCtrl', function ($scope, $ionicModal, $ionicPlatform, $timeout, $ionicNavBarDelegate, $state, Order) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    // Form data for the login modal
    $scope.$on('$ionicView.enter', function () {
        $ionicNavBarDelegate.showBackButton(false);
        $ionicPlatform.ready(function () {
            $scope.username = window.localStorage.getItem("username");
            console.log($scope.username);
        })
    });
    $scope.GoToOrder = function () {
        $state.go('app.order', {}, {
            reload: true
        });
    };
    $scope.goTo = function (view) {
        $state.go('app.' + view, {}, {
            reload: true
        });
    };
    $scope.$root.OrderLength = Order.getOrderLength();
}).controller('LoginCtrl', function ($scope, $stateParams, $ionicSideMenuDelegate, $ionicNavBarDelegate, $state, Login) {
    $scope.$on('$ionicView.enter', function () {
        // code to run each time view is entered
        $ionicNavBarDelegate.showBackButton(false);
    });
    //    var deregister = $ionicPlatform.registerBackButtonAction(function () {
    //        ionic.Platform.exitApp();
    //    }, 100);
    //    $scope.$on('$destroy', deregister);
    $scope.createUser = function (userFirstName, userLastName) {
        console.log(userFirstName, userLastName);
        Login.createUser(userFirstName, userLastName);
        $state.go('app.sessions', {}, {
            reload: true
        });
    }
    app.directive('focusMe', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(attrs.focusMe, function (value) {
                    if (value === true) {
                        console.log('value=', value);
                        //$timeout(function() {
                        element[0].focus();
                        scope[attrs.focusMe] = false;
                        //});
                    }
                });
            }
        };
    });
}).controller('CategoriesCtrl', function ($scope, $state, $stateParams, $mdDialog, $mdMedia, $ionicPopup, $timeout, $ionicNavBarDelegate, $ionicPlatform, Categories) {
    $scope.$on('$ionicView.enter', function () {
        // code to run each time view is entered
        $ionicNavBarDelegate.showBackButton(false);
    });
    $scope.showSpinner = false;
    var categories = Categories.getCategories();
    categories.then(function (result) {
        $scope.showSpinner = false;
        $scope.categories = result.data;
    }, function (err) {
        var badConnPopup = $ionicPopup.show({
            templateUrl: 'templates/bad_conn.html'
            , title: '!שגיאה'
            , subTitle: 'ישנה בעיה עם חיבור האינטרנט. אנא נסה שוב במועד מאוחר יותר'
            , scope: $scope
        });
        $timeout(function () {
            badConnPopup.close();
            $state.go("app.sessions", {}, {
                reload: false
            });
        }, 4000);
    });
    $scope.OpenMenu = function (menu_name, view_title, ev) {
        console.log(menu_name);
        $state.go("app." + menu_name + '/:view_title' + '/:prod_name', {
            view_title: view_title
            , prod_name: menu_name
        }, {
            reload: false
        });
    }
}).controller('ProdCtrl', function ($scope, $location, $state, $stateParams, $ionicNavBarDelegate, $ionicScrollDelegate, $ionicPopup, $timeout, $ionicPlatform, Product, Order) {
    var types = []
        , sizes = []
        , extras = []
        , spices = [];
    var prod_data;
    var view_title = $scope.view_title = $stateParams.view_title;
    var totalPrice = $scope.prodTotalPrice = 0;
    var current_type_price = 0;
    var prodAmount = $scope.prodAmount = 1;
    $scope.$on('$ionicView.enter', function () {
        // code to run each time view is entered
        $ionicNavBarDelegate.showBackButton(false);
    });
    $scope.changeScrollIcon = function () {
        console.log('change scroll icons');
        var scrollPosition = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition();
        if (scrollPosition.top > 0) {
            $scope.$root.showUp = true;
            $scope.$apply();
        }
        else {
            $scope.$root.showUp = false;
            $scope.$apply();
        }
    }
    $scope.scrollMainToDirection = function () {
        var scroll_position = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition();
        if (scroll_position.top != 0) $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
        else $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
    };
    Product.getProduct($stateParams.prod_name).then(function (res) {
        console.log(res);
        prod_data = res.data;
        if (prod_data.type) {
            $scope.types = types = prod_data.types;
            $scope.prodType = JSON.stringify(types[0]);
            $scope.sizeDisabled = types[0].size;
            if (types[0].size) {
                $scope.sizes = sizes = types[0].sizes;
                $scope.prodSize = sizes[0];
                console.log("prodSize: ", $scope.prodSize);
                current_type_price = sizes[0].price;
                $scope.prodTotalPrice = totalPrice = sizes[0].price;
            }
            else {
                current_type_price = JSON.parse(types[0].productPrice);
                $scope.prodTotalPrice = totalPrice = JSON.parse(types[0].productPrice);
            }
        }
        else {
            current_type_price = JSON.parse(prod_data.productPrice);
            $scope.prodTotalPrice = totalPrice = JSON.parse(prod_data.productPrice);
        }
        if (prod_data.size) {
            $scope.sizes = sizes = prod_data.sizes;
            $scope.prodSize = sizes[0];
            current_type_price = sizes[0].price;
            $scope.prodTotalPrice = totalPrice = sizes[0].price;
        }
        if (prod_data.extra) {
            $scope.extras = extras = prod_data.extras;
        }
        if (prod_data.spice) {
            $scope.spices = spices = prod_data.spices;
        }
    }, function (err) {
        var badConnPopup = $ionicPopup.show({
            templateUrl: 'templates/bad_conn.html'
            , title: '!שגיאה'
            , subTitle: 'ישנה בעיה עם חיבור האינטרנט. אנא נסה שוב במועד מאוחר יותר'
            , scope: $scope
        });
        $timeout(function () {
            badConnPopup.close();
            $state.go("app.sessions", {}, {
                reload: false
            });
        }, 4000);
    });
    $scope.onTypeChange = function (type) {
        var parsedType = JSON.parse(type);
        $scope.prodType = type;
        if (parsedType.size) {
            console.log(parsedType);
            console.log($scope.prodType);
            totalPrice -= current_type_price;
            if (parsedType.size) {
                $scope.sizes = sizes = parsedType.sizes;
                $scope.prodSize = sizes[0];
                totalPrice += JSON.parse(sizes[0].price);
                current_type_price = sizes[0].price;
            }
            else {
                $scope.sizeDisabled = parsedType.size;
                totalPrice += JSON.parse(parsedType.productPrice);
                current_type_price = JSON.parse(parsedType.productPrice);
            }
            $scope.prodTotalPrice = totalPrice;
            console.log("changes prod size to: ", $scope.prodSize);
        }
    };
    $scope.onSizeChange = function (size) {
        var parsedSize = size;
        console.log("onSizeChange: ", parsedSize);
        //$scope.cupSize = parsedSize;
        totalPrice -= current_type_price;
        totalPrice += JSON.parse(size.price);
        current_type_price = size.price;
        $scope.prodTotalPrice = totalPrice;
    };
    $scope.onExtrasChange = function (item) {
        if (item.checked) totalPrice += JSON.parse(item.extraPrice);
        else totalPrice -= JSON.parse(item.extraPrice);
        $scope.prodTotalPrice = totalPrice;
    };
    $scope.AddProductToOrder = function () {
        var prod_type = null
            , prod_size = null
            , prod_extras = null
            , prod_spices = null;
        if (prod_data.type) {
            prod_type = JSON.parse($scope.prodType);
            if (prod_type.size) {
                console.log($scope.prodSize);
                try {
                    prod_size = JSON.parse($scope.prodSize);
                }
                catch (e) {
                    prod_size = $scope.prodSize;
                }
            }
        }
        if (prod_data.size || (prod_type != null && prod_type.size)) {
            try {
                prod_size = JSON.parse($scope.prodSize);
            }
            catch (e) {
                prod_size = $scope.prodSize;
            }
        }
        if (prod_data.extra) {
            prod_extras = $scope.extras.filter(function (extra) {
                return extra.checked == true;
            });
        }
        var extra_info = $scope.$root.prodExInfo;
        var amount = $scope.prodAmount;
        console.log($scope.prodType);
        Product.createUserProduct($stateParams.view_title, prod_type, prod_size, prod_extras, prod_spices, extra_info, totalPrice, amount);
        var result = Product.addProductToOrder();
        if (result) {
            $scope.$root.prodExInfo = "";
            $scope.$root.OrderLength = Order.getOrderLength();
            var successPopup = $ionicPopup.show({
                templateUrl: 'templates/prod_added.html'
                , title: '!ההזמנה עודכנה'
                , subTitle: 'האם ברצונך להמשיך לקנות או לגשת להזמנה?'
                , scope: $scope
                , buttons: [{
                    text: 'המשך לקנות'
                    , type: 'button-default'
                    , onTap: function (e) {
                        console.log('המשך לקנות');
                        $state.go('app.categories', {}, {
                            reload: true
                        });
                    }
                    }, {
                    text: 'צפה בהזמנה'
                    , type: 'button-positive'
                    , onTap: function (e) {
                        console.log('גש לקופה');
                        $state.go('app.order', {}, {
                            reload: true
                        });
                    }
                    }]
            })
        }
    };
}).controller('SessionsCtrl', function ($rootScope, $scope, $ionicNavBarDelegate, $ionicSideMenuDelegate, $ionicPopup, $ionicPlatform, Order) {
    $scope.$on('$ionicView.enter', function () {
        // code to run each time view is entered
        $ionicNavBarDelegate.showBackButton(false);
    });
    var deregister;
    $scope.$on('$ionicView.leave', function () {
        console.log("leave main view");
        deregister();
    });
    $scope.$on('$ionicView.enter', function () {
        // code to run each time view is entered
        $ionicNavBarDelegate.showBackButton(false);
        deregister = $ionicPlatform.registerBackButtonAction(function () {
            ionic.Platform.exitApp();
        }, 100);
        $ionicSideMenuDelegate.canDragContent(true);
        var length = Order.getOrderLength();
        console.log(length);
        if (length > 0) $scope.isOrderEmpty = false;
        else $scope.isOrderEmpty = true;
        //var permissions = cordova.plugins.permissions;
    });
}).controller('OrderCtrl', function ($scope, $timeout, $stateParams, $ionicNavBarDelegate, $ionicPlatform, $ionicPopup, $ionicPopover, $timeout, Order) {
    $scope.$on('$ionicView.leave', function () {
        // code to run each time view is entered
        $scope.$root.showDeleteButton = false;
    });
    $scope.$root.showDeleteButton = false;
    $scope.$root.orderTotalPrice = 0;
    var order = [];
    $scope.$on('$ionicView.enter', function () {
        // code to run each time view is entered
        $ionicNavBarDelegate.showBackButton(false);
        $scope.showSpinner = false;
        $ionicPlatform.ready(function () {
            order = Order.ReadFromStorage();
            console.log($scope.check);
            console.log(order);
            $scope.order = order;
            $scope.$root.orderTotalPrice = 0;
            if (order != null) order.forEach(function (o) {
                console.log(o.productName);
                console.log(o.productPrice);
                $scope.$root.orderTotalPrice += o.productPrice * o.productAmount;
            });
            $timeout(function () {
                $scope.showSpinner = false;
                console.log('update with timeout fired');
            }, 1000);
        });
    });
    $scope.removeProduct = function (index) {
        $ionicPlatform.ready(function () {
            $scope.$root.orderTotalPrice -= order[index].productPrice * order[index].productAmount;
            $scope.order.splice(index, 1)
            Order.RemoveItem(index);
            $scope.$root.OrderLength = Order.getOrderLength();
        })
    }
    $scope.clearOrder = function () {
        $ionicPlatform.ready(function () {
            $scope.$root.orderTotalPrice = 0;
            Order.removeOrder();
            $scope.order = Order.ReadFromStorage();
            $scope.order = [];
            $scope.$root.OrderLength = Order.getOrderLength();
        })
    }
    $scope.sendOrder = function (totalPrice) {
        var deregisterBackButton = $ionicPlatform.registerBackButtonAction(function (e) {}, 401);
        var phonePopup = $ionicPopup.show({
            templateUrl: 'templates/phone.html'
            , title: 'הכנס מספר טלפון'
            , subTitle: ''
            , scope: $scope
            , buttons: [{
                text: 'בטל'
                , type: "button-default"
                , onTap: function (e) {
                    $scope.$root.orderTotalPrice = totalPrice;
                    return 0;
                }
                }, {
                text: 'שלח'
                , type: 'button-positive'
                , onTap: function (e) {
                    return 1;
                }
                }]
        }).then(function (res) {
            deregisterBackButton();
            if (res) {
                if (ionic.Platform.isAndroid()) {
                    Order.getSmsPermissions();
                    var sms_enabled;
                    if (SMS) SMS.startWatch(function () {
                        console.log('Waiting For Validation Sms');
                        sms_enabled = true;
                    }, function () {
                        console.log('failed to start watching');
                        sms_enabled = false;
                    });
                }
                var phoneNumber = '+972' + $scope.phoneNumber;
                Order.sendSms(phoneNumber).then(function (res) {
                    var deregisterBackButton = $ionicPlatform.registerBackButtonAction(function (e) {}, 401);
                    var authPopup = $ionicPopup.show({
                        templateUrl: 'templates/auth.html'
                        , title: 'הכנס קוד אימות'
                        , subTitle: ''
                        , scope: $scope
                        , buttons: [{
                            text: 'שלח'
                            , type: 'button-positive'
                            , onTap: function (e) {
                                return 1;
                            }
                        }]
                    });
                    authPopup.then(function (res) {
                        deregisterBackButton();
                        if (res) {
                            var authToken = $scope.authToken;
                            Order.login(phoneNumber, authToken).then(function (res) {
                                Order.processOrder(res.data.id_token, phoneNumber, order, $scope.$root.orderExInfo, $scope.timeForPickup, totalPrice).then(function (res) {
                                    var confirmPopup = $ionicPopup.show({
                                        templateUrl: 'templates/success.html'
                                        , title: "!ההזמנה נשלחה בהצלחה"
                                        , subTitle: 'שים לב, לאחר שהזמנתך תהיה מוכנה, נעדכן אותך באמצעות הודעה לפלאפון שברשותך'
                                        , scope: $scope
                                    });
                                    $timeout(function () {
                                        authPopup.close();
                                        confirmPopup.close();
                                    }, 4000);
                                    console.log("send order to server");
                                    $scope.clearOrder();
                                }, function (err) {
                                    var badConnPopup = $ionicPopup.show({
                                        templateUrl: 'templates/bad_conn.html'
                                        , title: '!שגיאה'
                                        , subTitle: 'ישנה בעיה עם חיבור האינטרנט. אנא נסה שוב במועד מאוחר יותר'
                                        , scope: $scope
                                    });
                                    $scope.$root.orderTotalPrice = totalPrice;
                                    $timeout(function () {
                                        badConnPopup.close();
                                        $state.go("app.sessions", {}, {
                                            reload: false
                                        });
                                    }, 4000);
                                })
                            }, function (err) {
                                var badConnPopup = $ionicPopup.show({
                                    templateUrl: 'templates/bad_conn.html'
                                    , title: '!שגיאה'
                                    , subTitle: 'ישנה בעיה עם חיבור האינטרנט. אנא נסה שוב במועד מאוחר יותר'
                                    , scope: $scope
                                });
                                $scope.$root.orderTotalPrice = totalPrice;
                                $timeout(function () {
                                    badConnPopup.close();
                                    $state.go("app.sessions", {}, {
                                        reload: false
                                    });
                                }, 4000);
                            });
                        }
                    });
                    if (ionic.Platform.isAndroid()) {
                        document.addEventListener('onSMSArrive', function (e) {
                            var sms = e.data;
                            var myRegexp = /([0-9]){6}/;
                            var match = myRegexp.exec(sms.body);
                            if (match != null) {
                                var confirmaionCode = match[0];
                                Order.login(phoneNumber, confirmaionCode).then(function (res) {
                                    deregisterBackButton();
                                    Order.processOrder(res.data.id_token, phoneNumber, order, $scope.$root.orderExInfo, $scope.timeForPickup, totalPrice).then(function (res) {
                                        var confirmPopup = $ionicPopup.show({
                                            templateUrl: 'templates/success.html'
                                            , title: "!ההזמנה נשלחה בהצלחה"
                                            , subTitle: 'שים לב, לאחר שהזמנתך תהיה מוכנה, נעדכן אותך באמצעות הודעה לפלאפון שברשותך'
                                            , scope: $scope
                                        });
                                        $timeout(function () {
                                            authPopup.close();
                                            confirmPopup.close();
                                        }, 4000);
                                        console.log("send order to server");
                                        $scope.clearOrder();
                                    }, function (err) {
                                        var badConnPopup = $ionicPopup.show({
                                            templateUrl: 'templates/bad_conn.html'
                                            , title: '!שגיאה'
                                            , subTitle: 'ישנה בעיה עם חיבור האינטרנט. אנא נסה שוב במועד מאוחר יותר'
                                            , scope: $scope
                                        });
                                        $scope.$root.orderTotalPrice = totalPrice;
                                        $timeout(function () {
                                            badConnPopup.close();
                                            $state.go("app.sessions", {}, {
                                                reload: false
                                            });
                                        }, 4000);
                                    })
                                }, function (err) {
                                    var badConnPopup = $ionicPopup.show({
                                        templateUrl: 'templates/bad_conn.html'
                                        , title: '!שגיאה'
                                        , subTitle: 'ישנה בעיה עם חיבור האינטרנט. אנא נסה שוב במועד מאוחר יותר'
                                        , scope: $scope
                                    });
                                    $scope.$root.orderTotalPrice = totalPrice;
                                    $timeout(function () {
                                        badConnPopup.close();
                                        $state.go("app.sessions", {}, {
                                            reload: false
                                        });
                                    }, 4000);
                                });
                                SMS.stopWatch(function () {
                                    console.log('watching', 'watching stopped');
                                }, function () {
                                    console.log('failed to stop watching');
                                });
                            }
                        });
                    }
                }, function (err) {
                    console.log(err);
                    var badConnPopup = $ionicPopup.show({
                        templateUrl: 'templates/bad_conn.html'
                        , title: '!שגיאה'
                        , subTitle: 'ישנה בעיה עם חיבור האינטרנט. אנא נסה שוב במועד מאוחר יותר'
                        , scope: $scope
                    });
                    $scope.$root.orderTotalPrice = totalPrice;
                    $timeout(function () {
                        badConnPopup.close();
                        $state.go("app.sessions", {}, {
                            reload: false
                        });
                    }, 4000);
                });
            }
        })
    }
}).controller('SessionCtrl', function ($scope, $stateParams) {});