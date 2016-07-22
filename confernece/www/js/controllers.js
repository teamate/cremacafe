angular.module('starter.controllers', ['AppServices']).controller('AppCtrl', function ($scope, $ionicModal, $timeout, $state, Order) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    // Form data for the login modal
    $scope.GoToOrder = function () {
        $state.go('app.order', {}, {
            reload: true
        });
    }
    $scope.$root.OrderLength = Order.getOrderLength();
}).controller('LoginCtrl', function ($scope, $stateParams) { /*TODO*/ }).controller('CategoriesCtrl', function ($scope, $state, $stateParams, $mdDialog, $mdMedia, $ionicNavBarDelegate, Categories) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.showSpinner = true;
    var categories = Categories.getCategories();
    categories.then(function (result) {
        $scope.showSpinner = false;
        $scope.categories = result.data;
    }, function (err) {});
    $scope.OpenMenu = function (menu_name, ev) {
        if (menu_name == "shakshuka") {
            $mdDialog.show({
                controller: ShakshukaCtrl
                , templateUrl: 'templates/shakshuka.html'
                , parent: angular.element(document.body)
                , targetEvent: ev
                , clickOutsideToClose: true
            })
        }
        else {
            $state.go("app." + menu_name, {}, {
                reload: false
            });
        }
    }

    function ShakshukaCtrl($scope, $mdDialog) {
        $scope.cancel = function () {
            $mdDialog.cancel();
        }
    }
}).controller('CoffeeCtrl', function ($scope, $location, $state, $stateParams, $ionicNavBarDelegate, $ionicPopup, Coffee, Order) {
    $ionicNavBarDelegate.showBackButton(true);
    var types = [];
    var totalPrice = $scope.coffeeTotalPrice = 0;
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
        console.log(err);
    });
    $scope.onTypeChange = function (type) {
        var parsedType = JSON.parse(type);
        $scope.coffeeType = type;
        $scope.sizeDisabled = parsedType.size;
        if (parsedType.size) {
            console.log(parsedType);
            console.log($scope.coffeeType);
            $scope.sizes = parsedType.sizes;
            $scope.cupSize = JSON.stringify(parsedType.sizes[0]);
            $scope.coffeeTotalPrice = totalPrice = parsedType.sizes[0].price;
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
        console.log($scope.coffeeType, $scope.coffeeType);
        Coffee.CreateCoffee(coffee_type, coffee_size, extra_info, totalPrice);
        var result = Coffee.AddToOrder($ionicPopup);
        if (result) {
            $scope.$root.coffeeExInfo = "";
            $scope.$root.OrderLength = Order.getOrderLength();
            var successPopup = $ionicPopup.show({
                title: '!ההזמנה עודכנה'
                , subTitle: 'להכניס פה פירוט של כמות הפריטים והחיר הכולל'
                , scope: $scope
                , buttons: [{
                    text: 'המשך לקנות'
                    , type: 'button-default'
                    , onTap: function (e) {
                        console.log('המשך לקנות');
                        $location.path('app/categories');
                    }
                    }, {
                    text: 'הכן קפה חדש'
                    , type: 'button-default'
                    , onTap: function (e) {
                        console.log('הכן קפה חדש');
                        $location.path('app/categories/coffee');
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
}).controller('SandwitchCtrl', function ($rootScope, $scope, $location, $state, $ionicNavBarDelegate, $ionicPopup, Sandwitch, Order) {
    $ionicNavBarDelegate.showBackButton(true);
    var types = [];
    var totalPrice = $scope.sandwitchTotalPrice = 0;
    var current_type_price = 0;
    $scope.$root.sandwitchExInfo = "";
    $scope.showSpinner = true;
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
    }, function (error) {});
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
        Sandwitch.CreateSandwitch(type, extras, extra_info, totalPrice);
        var result = Sandwitch.AddToOrder($ionicPopup);
        $scope.extras.filter(function (extra) {
            extra.checked = false;
            return;
        });
        if (result) {
            $scope.$root.toastExInfo = "";
            $scope.$root.OrderLength = Order.getOrderLength();
            var successPopup = $ionicPopup.show({
                title: '!ההזמנה עודכנה'
                , subTitle: 'להכניס פה פירוט של כמות הפריטים והחיר הכולל'
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
                        console.log('הכן כריך חדש');
                        $location.path('app/categories/sandwiches');
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
}).controller('ShakshukaCtrl', function ($rootScope, $scope, $location, $state, $stateParams, $ionicNavBarDelegate, $ionicPopup, Order) {}).controller('ToastCtrl', function ($rootScope, $scope, $location, $state, $stateParams, $ionicNavBarDelegate, $ionicPopup, Tost, Order) {
    $ionicNavBarDelegate.showBackButton(true);
    var toast = null;
    var totalPrice = 0;
    $scope.$root.toastExInfo = "";
    $scope.showSpinner = true;
    Tost.getToast().then(function (res) {
        $scope.showSpinner = false;
        console.log(res.data);
        toast = res.data;
        console.log(toast.extra);
        if (toast.extra) $scope.extras = toast.extras;
        totalPrice = $scope.toastTotalPrice = JSON.parse(toast.productPrice); //Default
    }, function (err) {
        //TODO
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
        Tost.CreateTost(extras, extra_info, totalPrice);
        var result = Tost.AddToOrder($ionicPopup);
        $scope.extras.filter(function (extra) {
            extra.checked = false;
            return;
        });
        if (result) {
            $scope.$root.toastExInfo = "";
            $scope.$root.OrderLength = Order.getOrderLength();
            var successPopup = $ionicPopup.show({
                title: '!ההזמנה עודכנה'
                , subTitle: 'להכניס פה פירוט של כמות הפריטים והחיר הכולל'
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
}).controller('SessionsCtrl', function ($rootScope, $scope, $ionicNavBarDelegate, Order) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.$on('$ionicView.enter', function () {
        // code to run each time view is entered
        var length = Order.getOrderLength();
        console.log(length);
        if (length > 0) $scope.isOrderEmpty = false;
        else $scope.isOrderEmpty = true;
    });
}).controller('OrderCtrl', function ($scope, $timeout, $stateParams, $ionicNavBarDelegate, $ionicPlatform, Order) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.$root.showDeleteButton = false;
    $scope.$root.orderTotalPrice = 0;
    var order = [];
    $scope.$on('$ionicView.enter', function () {
        // code to run each time view is entered
        $scope.showSpinner = true;
        $ionicPlatform.ready(function () {
            order = Order.ReadFromStorage();
            console.log($scope.check);
            console.log(order);
            $scope.order = order;
            $scope.$root.orderTotalPrice = 0;
            if (order != null) order.forEach(function (o) {
                console.log(o.productPrice);
                $scope.$root.orderTotalPrice += o.productPrice;
            });
            $timeout(function () {
                $scope.showSpinner = false;
                console.log('update with timeout fired');
            }, 1000);
        });
    });
    $scope.removeProduct = function (index) {
        $ionicPlatform.ready(function () {
            $scope.$root.orderTotalPrice -= order[index].productPrice;
            $scope.order.splice(index, 1)
            Order.RemoveItem(index);
            $scope.$root.OrderLength = Order.getOrderLength();
        })
    }
    $scope.clearOrder = function () {
        $ionicPlatform.ready(function () {
            $scope.$root.orderTotalPrice = 0;
            Order.ClearLocalStorage();
            $scope.order = Order.ReadFromStorage();
            $scope.$root.OrderLength = Order.getOrderLength();
        })
    }
}).controller('SessionCtrl', function ($scope, $stateParams) {});