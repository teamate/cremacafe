angular.module('starter.controllers', ['AppServices']).controller('AppCtrl', function ($scope, $ionicModal, $ionicPlatform, $timeout, $state, Order) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    // Form data for the login modal
    $scope.$on('$ionicView.enter', function () {
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
}).controller('LoginCtrl', function ($scope, $stateParams, $ionicSideMenuDelegate, $state, Login) {
    $ionicSideMenuDelegate.canDragContent(false);
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
    $ionicNavBarDelegate.showBackButton(false);
    //    $ionicPlatform.registerBackButtonAction(function () {
    //        $state.go('app.sessions', {}, {
    //            reload: false
    //        });
    //    }, 100);
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
    $scope.OpenMenu = function (menu_name, ev) {
        console.log(menu_name);
        $state.go("app." + menu_name, {}, {
            reload: false
        });
    }
}).controller('CoffeeCtrl', function ($scope, $location, $state, $stateParams, $ionicNavBarDelegate, $ionicPopup, $timeout, $ionicPlatform, Coffee, Order) {
    $ionicNavBarDelegate.showBackButton(true);
    //    $ionicPlatform.registerBackButtonAction(function () {
    //        $state.go('app.categories', {}, {
    //            reload: false
    //        });
    //    }, 100);
    var types = [];
    var totalPrice = $scope.coffeeTotalPrice = 0;
    $scope.coffeeAmount = 1;
    Coffee.getCoffee().then(function (res) {
        console.log(res);
        if (res.data.type) {
            $scope.types = types = res.data.types;
            $scope.coffeeType = JSON.stringify(types[0]);
            $scope.sizeDisabled = types[0].size;
            if (types[0].size) {
                $scope.sizes = types[0].sizes;
                $scope.cupSize = JSON.stringify(types[0].sizes[0]);
                $scope.coffeeTotalPrice = totalPrice = types[0].sizes[0].price;
            }
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
        $scope.coffeeType = type;
        $scope.sizeDisabled = parsedType.size;
        if (parsedType.size) {
            console.log(parsedType);
            console.log($scope.coffeeType);
            $scope.sizes = parsedType.sizes;
            //$scope.cupSize = JSON.stringify(parsedType.sizes[0]);
            //$scope.coffeeTotalPrice = totalPrice = parsedType.sizes[0].price;
        }
    }
    $scope.onSizeChange = function (size) {
        var parsedSize = JSON.parse(size);
        $scope.cupSize = size;
        console.log($scope.cupSize);
        $scope.coffeeTotalPrice = totalPrice = parsedSize.price;
    }
    $scope.AddCoffeeToOrder = function () {
        var coffee_type = JSON.parse($scope.coffeeType);
        var coffee_size = JSON.parse($scope.cupSize);
        var extra_info = $scope.$root.coffeeExInfo;
        var amount = $scope.coffeeAmount;
        console.log($scope.coffeeType, $scope.coffeeType);
        Coffee.CreateCoffee(coffee_type, coffee_size, extra_info, totalPrice, amount);
        var result = Coffee.AddToOrder($ionicPopup);
        if (result) {
            $scope.$root.coffeeExInfo = "";
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
                    text: 'הכן קפה חדש'
                    , type: 'button-default'
                    , onTap: function (e) {
                        console.log('הכן קפה חדש');
                        $state.go('app.coffee', {}, {
                            reload: true
                        });
                    }
                    }, {
                    text: 'גש לקופה'
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
}).controller('SandwitchCtrl', function ($rootScope, $scope, $location, $state, $ionicNavBarDelegate, $ionicPopup, $timeout, $ionicPlatform, Sandwitch, Order) {
    $ionicNavBarDelegate.showBackButton(true);
    //    $ionicPlatform.registerBackButtonAction(function () {
    //        $state.go('app.categories', {}, {
    //            reload: false
    //        });
    //    }, 100);
    var types = [];
    var totalPrice = $scope.sandwitchTotalPrice = 0;
    var current_type_price = 0;
    $scope.sandwichAmount = 1;
    $scope.$root.sandwitchExInfo = "";
    $scope.showSpinner = false;
    Sandwitch.getSandwitch().then(function (res) {
        $scope.showSpinner = false;
        if (res.data.type) {
            $scope.types = types = res.data.types;
            console.log(types[0]);
            $scope.sandwitchType = JSON.stringify(types[0]);
            current_type_price = types[0].productPrice;
            totalPrice = $scope.sandwitchTotalPrice = JSON.parse(types[0].productPrice); //Default
        }
        if (res.data.extra) $scope.extras = res.data.extras;
    }, function (error) {
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
    $scope.TypesChange = function (item) {
        console.log(item);
        totalPrice -= current_type_price;
        totalPrice += JSON.parse(JSON.parse(item).productPrice);
        current_type_price = JSON.parse(JSON.parse(item).productPrice);
        $scope.sandwitchTotalPrice = totalPrice;
    }
    $scope.ExtrasChange = function (item) {
        if (item.checked) totalPrice += JSON.parse(item.extraPrice);
        else totalPrice -= JSON.parse(item.extraPrice);
        $scope.sandwitchTotalPrice = totalPrice;
    }
    $scope.AddSandwitchToOrder = function () {
        console.log("im here");
        var extras = $scope.extras.filter(function (extra) {
            return extra.checked == true;
        });
        var extra_info = $scope.$root.sandwitchExInfo;
        var type = JSON.parse($scope.sandwitchType);
        var amount = $scope.sandwichAmount;
        Sandwitch.CreateSandwitch(type, extras, extra_info, totalPrice, amount);
        var result = Sandwitch.AddToOrder($ionicPopup);
        //        $scope.extras.filter(function (extra) {
        //            extra.checked = false;
        //            return;
        //        });
        if (result) {
            $scope.$root.toastExInfo = "";
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
                    text: 'הכן כריך חדש'
                    , type: 'button-default'
                    , onTap: function (e) {
                        console.log('הכן כריך חדש');
                        $state.go('app.sandwiches', {}, {
                            reload: true
                        });
                    }
                    }, {
                    text: 'גש לקופה'
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
}).controller('ShakshukaCtrl', function ($rootScope, $scope, $location, $state, $stateParams, $ionicNavBarDelegate, $ionicPopup, $timeout, $ionicPlatform, Shakshuka, Order) {
    $ionicNavBarDelegate.showBackButton(true);
    //    $ionicPlatform.registerBackButtonAction(function () {
    //        $state.go('app.categories', {}, {
    //            reload: false
    //        });
    //    }, 100);
    var shakshuka = null;
    var totalPrice = 0;
    $scope.shakshukaAmount = 1;
    $scope.$root.shakshukaExInfo = "";
    $scope.showSpinner = false;
    Shakshuka.getShakshuka().then(function (res) {
        $scope.showSpinner = false;
        console.log(res.data);
        shakshuka = res.data;
        console.log(shakshuka.extra);
        if (shakshuka.extra) $scope.extras = shakshuka.extras;
        totalPrice = $scope.shakshukaTotalPrice = JSON.parse(shakshuka.productPrice); //Default
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
    $scope.ExtrasChange = function (item) {
        console.log(item);
        if (item.checked) totalPrice += JSON.parse(item.extraPrice);
        else totalPrice -= JSON.parse(item.extraPrice);
        $scope.shakshukaTotalPrice = totalPrice;
    }
    $scope.AddShakshukaToOrder = function () {
        var extras = $scope.extras.filter(function (extra) {
            return extra.checked == true;
        });
        var extra_info = $scope.$root.shakshukaExInfo;
        var amount = $scope.shakshukaAmount;
        Shakshuka.createShakshuka(extras, extra_info, totalPrice, amount);
        var result = Shakshuka.AddToOrder($ionicPopup);
        //        $scope.extras.filter(function (extra) {
        //            extra.checked = false;
        //            return;
        //        });
        if (result) {
            $scope.$root.shakshukaExInfo = "";
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
                        $location.path('app/categories');
                    }
                    }, {
                    text: 'הזמן מנה נוספת'
                    , type: 'button-default'
                    , onTap: function (e) {
                        console.log('הכן שקשוקה חדש');
                        $location.path('app/categories/shakshuka');
                    }
                    }, {
                    text: 'גש לקופה'
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
}).controller('ToastCtrl', function ($rootScope, $scope, $location, $state, $stateParams, $ionicNavBarDelegate, $ionicPopup, $timeout, $ionicPlatform, Tost, Order) {
    $ionicNavBarDelegate.showBackButton(true);
    //    $ionicPlatform.registerBackButtonAction(function () {
    //        $state.go('app.categories', {}, {
    //            reload: false
    //        });
    //    }, 100);
    var toast = null;
    var totalPrice = 0;
    $scope.toastAmount = 1;
    $scope.$root.toastExInfo = "";
    $scope.showSpinner = false;
    Tost.getToast().then(function (res) {
        $scope.showSpinner = false;
        console.log(res.data);
        toast = res.data;
        console.log(toast.extra);
        if (toast.extra) $scope.extras = toast.extras;
        totalPrice = $scope.toastTotalPrice = JSON.parse(toast.productPrice); //Default
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
    $scope.ExtrasChange = function (item) {
            if (item.checked) totalPrice += JSON.parse(item.extraPrice);
            else totalPrice -= JSON.parse(item.extraPrice);
            $scope.toastTotalPrice = totalPrice;
        }
        //adds a tost to the order
    $scope.AddTostToOrder = function () {
        var extras = $scope.extras.filter(function (extra) {
            return extra.checked == true;
        });
        var extra_info = $scope.$root.toastExInfo;
        var amount = $scope.toastAmount;
        Tost.CreateTost(extras, extra_info, totalPrice, amount);
        var result = Tost.AddToOrder($ionicPopup);
        //        $scope.extras.filter(function (extra) {
        //            extra.checked = false;
        //            return;
        //        });
        if (result) {
            $scope.$root.toastExInfo = "";
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
                        $location.path('app/categories');
                    }
                    }, {
                    text: 'הכן טוסט חדש'
                    , type: 'button-default'
                    , onTap: function (e) {
                        console.log('הכן טוסט חדש');
                        $location.path('app/categories/toast');
                    }
                    }, {
                    text: 'גש לקופה'
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
    $ionicNavBarDelegate.showBackButton(false);
    $ionicSideMenuDelegate.canDragContent(true);
    var deregister;
    $scope.$on('$ionicView.leave', function () {
        console.log("leave main view");
        deregister();
    });
    $scope.$on('$ionicView.enter', function () {
        // code to run each time view is entered
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
}).controller('OrderCtrl', function ($scope, $timeout, $stateParams, $ionicNavBarDelegate, $ionicPlatform, $ionicPopup, $timeout, Order) {
    $ionicNavBarDelegate.showBackButton(false);
    //    $ionicPlatform.registerBackButtonAction(function () {
    //        $state.go('app.sessions', {}, {
    //            reload: false
    //        });
    //    }, 100);
    $scope.$root.showDeleteButton = false;
    $scope.$root.orderTotalPrice = 0;
    var order = [];
    $scope.$on('$ionicView.enter', function () {
        // code to run each time view is entered
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
    $scope.sendOrder = function () {
        var phonePopup = $ionicPopup.show({
            templateUrl: 'templates/phone.html'
            , title: 'הכנס מספר טלפון'
            , subTitle: ''
            , scope: $scope
            , buttons: [{
                text: 'בטל'
                , type: "button-default"
                , onTap: function (e) {
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
            if (res) {
                Order.getSmsPermissions();
                var sms_enabled;
                if (SMS) SMS.startWatch(function () {
                    console.log('Waiting For Validation Sms');
                    sms_enabled = true;
                }, function () {
                    console.log('failed to start watching');
                    sms_enabled = false;
                });
                var phoneNumber = '+972' + $scope.phoneNumber;
                Order.sendSms(phoneNumber).then(function (res) {
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
                        if (res) {
                            var authToken = $scope.authToken;
                            Order.login(phoneNumber, authToken).then(function (res) {
                                Order.processOrder(res.data.id_token, phoneNumber, order, $scope.$root.orderExInfo, $scope.timeForPickup, $scope.$root.orderTotalPrice).then(function (res) {
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
                                $timeout(function () {
                                    badConnPopup.close();
                                    $state.go("app.sessions", {}, {
                                        reload: false
                                    });
                                }, 4000);
                            });
                        }
                    });
                    document.addEventListener('onSMSArrive', function (e) {
                        var sms = e.data;
                        var myRegexp = /verification code is: (([0-9]){6})/g;
                        var match = myRegexp.exec(sms.body);
                        if (match != null) {
                            var confirmaionCode = match[1];
                            Order.login(phoneNumber, confirmaionCode).then(function (res) {
                                Order.processOrder(res.data.id_token, phoneNumber, order, $scope.$root.orderExInfo, $scope.timeForPickup, $scope.$root.orderTotalPrice).then(function (res) {
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
            }
        })
    }
}).controller('SessionCtrl', function ($scope, $stateParams) {});