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
}).controller('LoginCtrl', function ($scope, $stateParams) {}).controller('CategoriesCtrl', function ($scope, $stateParams, $ionicNavBarDelegate, Categories) {
    $ionicNavBarDelegate.showBackButton(false);
    $scope.showSpinner = true;
    var categories = Categories.getCategories();
    categories.then(function (result) {
        $scope.showSpinner = false;
        $scope.categories = result.data;
    }, function (err) {});
}).controller('CoffeeCtrl', function ($scope, $stateParams, $ionicNavBarDelegate, $ionicPopup, Coffee) {
    $scope.cupSize = Coffee.getCoffeeSizes();
    $scope.coffeeTypes = Coffee.getCoffeeTypes();
    $scope.milkTypes = Coffee.getMilkTypes();
    var chosen_cup_size = $scope.cupSize[0];
    $scope.$parent.cupChoice = chosen_cup_size;
    var totalPrice = $scope.totalPrice = chosen_cup_size.price;
    $scope.CupSizeChange = function (item) {
        totalPrice += item.price - chosen_cup_size.price;
        $scope.totalPrice = totalPrice;
        chosen_cup_size = item;
    }
    $scope.CoffeeTypeChange = function (item) {
        if (item.checked) totalPrice += item.price;
        else totalPrice -= item.price;
        $scope.totalPrice = totalPrice;
    }
    $scope.MilkTypeChange = function (item) {
            if (item.checked) totalPrice += item.price;
            else totalPrice -= item.price;
            $scope.totalPrice = totalPrice;
        }
        //adds a coffee to the order
    $scope.AddCoffeeToOrder = function () {
        Coffee.CreateCoffee(chosen_cup_size, $scope.coffeeTypes, $scope.milkTypes, extra_info, totalPrice);
        var coffeeT = $scope.coffeeTypes.filter(function (coffee) {
            return coffee.checked == true;
        });
        var milkT = $scope.MilkTypes.filter(function (milk) {
            return milk.checked == true
        });
        var extra_info = $scope.exInfo;
        var result = Coffee.AddToOrder($ionicPopup);
        if (result) {
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
                        console.log('הכן טוסט חדש');
                        $location.path('app/categories/coffee');
                    }
                    }, {
                    text: 'גש לקופה'
                    , type: 'button-positive'
                    , onTap: function (e) {
                        console.log('גש לקופה');
                        $location.path('app/order');
                    }
                    }]
            })
        }
    };
}).controller('ToastCtrl', function ($rootScope, $scope, $location, $state, $stateParams, $ionicNavBarDelegate, $ionicPopup, Tost, Order) {
    var toast = null;
    var totalPrice = 0;
    $scope.$root.exInfo = "";
    $scope.exInfo = "";
    $scope.showSpinner = true;
    Tost.getToast().then(function (res) {
        $scope.showSpinner = false;
        console.log(res.data);
        toast = res.data;
        console.log(toast.extra);
        if (toast.extra) $scope.extras = toast.extras;
        totalPrice = $scope.totalPrice = JSON.parse(toast.productPrice); //Default
    }, function (err) {
        //TODO
    });
    $scope.ExtrasChange = function (item) {
            if (item.checked) totalPrice += JSON.parse(item.extraPrice);
            else totalPrice -= JSON.parse(item.extraPrice);
            $scope.totalPrice = totalPrice;
        }
        //adds a tost to the order
    $scope.AddTostToOrder = function () {
        var extras = $scope.extras.filter(function (extra) {
            return extra.checked == true;
        });
        var extra_info = $scope.$root.exInfo;
        Tost.CreateTost(extras, extra_info, totalPrice);
        var result = Tost.AddToOrder($ionicPopup);
        $scope.extras.filter(function (extra) {
            extra.checked = false;
            return;
        });
        if (result) {
            $scope.$root.exInfo = "";
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
            if (order != null) order.forEach(function (o) {
                $scope.$root.orderTotalPrice += o.price;
            });
            $timeout(function () {
                $scope.showSpinner = false;
                console.log('update with timeout fired');
            }, 1000);
        });
    });
    $scope.removeProduct = function (index) {
        $ionicPlatform.ready(function () {
            $scope.$root.orderTotalPrice -= order[index].price;
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