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
        $state.go("app." + menu_name + '/:view_title', {
            view_title: view_title
        }, {
            reload: false
        });
    }
}).controller('CoffeeCtrl', function ($scope, $location, $state, $stateParams, $ionicNavBarDelegate, $ionicScrollDelegate, $ionicPopup, $timeout, $ionicPlatform, Coffee, Order) {
    $scope.view_title = $stateParams.view_title;
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
    var types = [];
    var totalPrice = $scope.coffeeTotalPrice = 0;
    var current_type_price = 0;
    $scope.coffeeAmount = 1;
    Coffee.getCoffee().then(function (res) {
        console.log(res);
        if (res.data.type) {
            $scope.types = types = res.data.types;
            $scope.coffeeType = JSON.stringify(types[0]);
            $scope.sizeDisabled = types[0].size;
            if (types[0].size) {
                $scope.sizes = types[0].sizes;
                $scope.cupSize = $scope.sizes[0];
                console.log("cupSize: ", $scope.cupSize);
                current_type_price = $scope.sizes[0].price;
                $scope.coffeeTotalPrice = totalPrice = types[0].sizes[0].price;
            }
            if (res.data.extra) {
                $scope.extras = res.data.extras;
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
            $scope.cupSize = $scope.sizes[0];
            totalPrice -= current_type_price;
            totalPrice += JSON.parse($scope.sizes[0].price);
            current_type_price = $scope.sizes[0].price;
            $scope.coffeeTotalPrice = totalPrice;
            console.log("changes cup size to: ", $scope.cupSize);
        }
    }
    $scope.ExtrasChange = function (item) {
        if (item.checked) totalPrice += JSON.parse(item.extraPrice);
        else totalPrice -= JSON.parse(item.extraPrice);
        $scope.coffeeTotalPrice = totalPrice;
    }
    $scope.onSizeChange = function (size) {
        var parsedSize = size;
        console.log("onSizeChange: ", parsedSize);
        //$scope.cupSize = parsedSize;
        totalPrice -= current_type_price;
        totalPrice += JSON.parse(size.price);
        current_type_price = size.price;
        $scope.coffeeTotalPrice = totalPrice;
    }
    $scope.AddCoffeeToOrder = function () {
        var extras = $scope.extras.filter(function (extra) {
            return extra.checked == true;
        });
        var coffee_type = JSON.parse($scope.coffeeType);
        var coffee_size = JSON.parse($scope.cupSize);
        var extra_info = $scope.$root.coffeeExInfo;
        var amount = $scope.coffeeAmount;
        console.log($scope.coffeeType, $scope.coffeeType);
        Coffee.CreateCoffee(extras, coffee_type, coffee_size, extra_info, totalPrice, amount);
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
}).controller('SandwitchCtrl', function ($rootScope, $scope, $location, $state, $stateParams, $ionicNavBarDelegate, $ionicScrollDelegate, $ionicPopup, $timeout, $ionicPlatform, Sandwitch, Order) {
    $scope.view_title = $stateParams.view_title;
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
            $scope.$root.sandwitchExInfo = "";
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
}).controller('ShakshukaCtrl', function ($rootScope, $scope, $location, $state, $stateParams, $ionicNavBarDelegate, $ionicScrollDelegate, $ionicPopup, $timeout, $ionicPlatform, Shakshuka, Order) {
    $scope.view_title = $stateParams.view_title;
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
}).controller('ToastCtrl', function ($rootScope, $scope, $location, $state, $stateParams, $ionicNavBarDelegate, $ionicScrollDelegate, $ionicPopup, $timeout, $ionicPlatform, Tost, Order) {
    $scope.view_title = $stateParams.view_title;
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
}).controller('NargilaCtrl', function ($rootScope, $scope, $location, $state, $stateParams, $ionicNavBarDelegate, $ionicScrollDelegate, $ionicPopup, $timeout, $ionicPlatform, Nargila, Order) {
    $scope.view_title = $stateParams.view_title;
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
    var types = [];
    var totalPrice = $scope.nargilaTotalPrice = 0;
    var current_type_price = 0;
    $scope.nargilaAmount = 1;
    $scope.$root.nargilaExInfo = "";
    $scope.showSpinner = false;
    Nargila.getNargila().then(function (res) {
        $scope.showSpinner = false;
        if (res.data.type) {
            $scope.types = types = res.data.types;
            console.log(types[0]);
            $scope.nargilaType = JSON.stringify(types[0]);
            current_type_price = types[0].productPrice;
            totalPrice = $scope.nargilaTotalPrice = JSON.parse(types[0].productPrice); //Default
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
        $scope.nargilaTotalPrice = totalPrice;
    }
    $scope.ExtrasChange = function (item) {
        if (item.checked) totalPrice += JSON.parse(item.extraPrice);
        else totalPrice -= JSON.parse(item.extraPrice);
        $scope.nargilaTotalPrice = totalPrice;
    }
    $scope.AddNargilaToOrder = function () {
        console.log("adding nargila to order... ");
        var extras = $scope.extras.filter(function (extra) {
            return extra.checked == true;
        });
        var extra_info = $scope.$root.nargilaExInfo;
        var type = JSON.parse($scope.nargilaType);
        var amount = $scope.nargilaAmount;
        Nargila.CreateNargila(type, extras, extra_info, totalPrice, amount);
        var result = Nargila.AddToOrder($ionicPopup);
        //        $scope.extras.filter(function (extra) {
        //            extra.checked = false;
        //            return;
        //        });
        if (result) {
            $scope.$root.nargilaExInfo = "";
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
}).controller('BurekasCtrl', function ($rootScope, $scope, $location, $state, $stateParams, $ionicNavBarDelegate, $ionicScrollDelegate, $ionicPopup, $timeout, $ionicPlatform, Burekas, Order) {
    $scope.view_title = $stateParams.view_title;
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
    var burekas = null;
    var totalPrice = 0;
    $scope.burekasAmount = 1;
    $scope.$root.burekasExInfo = "";
    $scope.showSpinner = false;
    Burekas.getBurekas().then(function (res) {
        $scope.showSpinner = false;
        console.log(res.data);
        burekas = res.data;
        console.log(burekas.extra);
        if (burekas.extra) $scope.extras = burekas.extras;
        totalPrice = $scope.burekasTotalPrice = JSON.parse(burekas.productPrice); //Default
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
        $scope.burekasTotalPrice = totalPrice;
    }
    $scope.AddBurekasToOrder = function () {
        var extras = $scope.extras.filter(function (extra) {
            return extra.checked == true;
        });
        var extra_info = $scope.$root.burekasExInfo;
        var amount = $scope.burekasAmount;
        Burekas.createBurekas(extras, extra_info, totalPrice, amount);
        var result = Burekas.AddToOrder($ionicPopup);
        //        $scope.extras.filter(function (extra) {
        //            extra.checked = false;
        //            return;
        //        });
        if (result) {
            $scope.$root.burekasExInfo = "";
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