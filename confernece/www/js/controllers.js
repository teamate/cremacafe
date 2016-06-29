angular.module('starter.controllers', ['AppServices'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal

})

.controller('LoginCtrl', function($scope, $stateParams) {
  })

  .controller('CategoriesCtrl', function($scope, $stateParams, $ionicNavBarDelegate) {
    $ionicNavBarDelegate.showBackButton(true);
  })

  .controller('CoffeeCtrl', function($scope, $stateParams, $ionicNavBarDelegate, $ionicPopup, Coffee) {
    $scope.cupSize = Coffee.getCoffeeSizes();
    $scope.coffeeTypes = Coffee.getCoffeeTypes();
    $scope.milkTypes = Coffee.getMilkTypes();
    
    var chosen_cup_size = $scope.cupSize[0];
    $scope.$parent.cupChoice = chosen_cup_size;
    var totalPrice = $scope.totalPrice = chosen_cup_size.price;

    $scope.CupSizeChange = function(item){
        totalPrice += item.price - chosen_cup_size.price;
        $scope.totalPrice = totalPrice;
        chosen_cup_size = item;
    }
    
    $scope.CoffeeTypeChange = function(item){
        if(item.checked)
            totalPrice += item.price;
        else
            totalPrice -= item.price;
        $scope.totalPrice = totalPrice;
    }
    
    $scope.MilkTypeChange = function(item){
        if(item.checked)
            totalPrice += item.price;
        else
            totalPrice -= item.price;
        $scope.totalPrice = totalPrice;
    }
    
    //adds a coffee to the order
    $scope.AddCoffeeToOrder = function(){
        Tost.CreateCoffee(chosen_cup_size, coffeeType, milkType, extra_info, totalPrice);
        var coffeeT = $scope.coffeeTypes.filter(function(coffee){return coffee.checked == true;});
        var milkT = $scope.MilkTypes.filter(function(milk){return milk.checked == true});
        var extra_info = $scope.exInfo;
        var result = Coffee.AddToOrder($ionicPopup);
        if(result){
            var successPopup = $ionicPopup.show({   
                title: '!ההזמנה עודכנה',
                subTitle: 'להכניס פה פירוט של כמות הפריטים והחיר הכולל',
                scope: $scope, 
                buttons: [{
                        text:'המשך לקנות',
                        type: 'button-default',
                        onTap: function(e){
                            console.log('המשך לקנות');
                            $location.path('app/categories');
                        }
                    },{
                        text:'הכן קפה חדש',
                        type: 'button-default',
                        onTap: function(e){
                            console.log('הכן טוסט חדש');
                            $location.path('app/categories/coffee');

                        }
                    },{
                        text: 'גש לקופה',
                        type: 'button-positive',
                        onTap: function(e){
                            console.log('גש לקופה');
                            $location.path('app/order');

                        }
                    }]
                }) 
        }
    };
    
    
  })

.controller('MakeTostCtrl', function($scope, $location, $stateParams, $ionicNavBarDelegate, $ionicPopup, Tost) {
    $scope.breadTypes = Tost.getBreadTypes();
    $scope.tosafot = Tost.getTosafot();
    $scope.sauces = Tost.getSauces();
    
    var chosen_bread_item = $scope.breadTypes[0]; //default
    $scope.$parent.breadChoice = chosen_bread_item;
    var totalPrice = $scope.totalPrice = chosen_bread_item.price; //Default
    
    //handles change events in bread types ion-radio
    $scope.BreadTypeChange = function(item){
        totalPrice += item.price - chosen_bread_item.price;
        $scope.totalPrice = totalPrice;
        chosen_bread_item = item;
    };
    
    $scope.TosafotChange = function(item){
        if(item.checked)
            totalPrice += item.price;
        else
            totalPrice -= item.price;
        $scope.totalPrice = totalPrice;
    }
    
    $scope.SaucesChange = function(item){
        if(item.checked)
            totalPrice += item.price;
        else
            totalPrice -= item.price;
        $scope.totalPrice = totalPrice;
    }
    
    //adds a tost to the order
    $scope.AddTostToOrder = function(){
        Tost.CreateTost(chosen_bread_item, tosafot, sauces, extra_info, totalPrice);
        var tosafot = $scope.tosafot.filter(function(tosefet){return tosefet.checked == true;});
        var sauces = $scope.sauces.filter(function(sauce){return sauce.checked == true});
        var extra_info = $scope.exInfo;
        var result = Tost.AddToOrder($ionicPopup);
        if(result){
            var successPopup = $ionicPopup.show({   
                title: '!ההזמנה עודכנה',
                subTitle: 'להכניס פה פירוט של כמות הפריטים והחיר הכולל',
                scope: $scope, 
                buttons: [{
                        text:'המשך לקנות',
                        type: 'button-default',
                        onTap: function(e){
                            console.log('המשך לקנות');
                            $location.path('app/categories');
                        }
                    },{
                        text:'הכן טוסט חדש',
                        type: 'button-default',
                        onTap: function(e){
                            console.log('הכן טוסט חדש');
                            $location.path('app/categories/makeTost');

                        }
                    },{
                        text: 'גש לקופה',
                        type: 'button-positive',
                        onTap: function(e){
                            console.log('גש לקופה');
                            $location.path('app/order');

                        }
                    }]
                }) 
        }
    };
  })

.controller('SessionsCtrl', function($rootScope, $scope, $ionicNavBarDelegate ) {
    $ionicNavBarDelegate.showBackButton(false);
})

.controller('OrderCtrl', function($scope, $stateParams, $ionicNavBarDelegate){
    
})

.controller('SessionCtrl', function($scope, $stateParams) {
});
