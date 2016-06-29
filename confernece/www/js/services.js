angular.module('AppServices', ['ngResource'])

.factory('HttpReqs', function($http){
    
    this.ParseGetParams = function(params){
        var result = '?';
        for(var key in params){
            result += key + '=';
            result += params[key] + '&';
        }
        
        result = result.substring(0, substring.length-1);
        
        return result
    }
    
    this.GetRequest = function(path, params){
        var parsed_params = this.ParseGetParams(params);
        $http({
            method: 'GET',
            url: path + '/' + parsed_params
        }).then(function successCallback(response){
            //TODO
        }, function errorCallback(response){
            //TODO
        });
    }
    
    this.PostRequest = function(path, myData){
        $http({
            method: 'POST',
            url: path,
            headers: {
                'Content-Type': 'application/json'
            },
            data: myData
        }).then(function successCallback(response){
            //TODO
        }, function errorCallback(response){
           //TODO 
        });
    }
})

.factory('Coffee', function(Order){
    
    var uerCoffee = {};
    
    this.getCoffeeSizes = function(){
        var coffee_sizes = [{value:"0", name:"גדול", price:5},{value:"1", name:"קטן", price:7},{value:"2", name:"בינוני", price:9}];
        return coffee_sizes;
    }
    
    this.getCoffeeTypes = function(){
        var coffee_types = [{value:"0", name:"הפוך", checked: true, price:0},{value:"1", name:"שחור", checked: false, price:0},{value:"2", name:"תה", checked: false, price:0},{value:"3", name:"שוקו", checked: false, price:0}];
        return coffee_types;
    }
    
    this.getMilkTypes = function(){
        var milk_types = [{value:"0", name:"חלב 1%", checked:true, price:0},{value:"1", name:"חלב 2%", checked:true, price:0},{value:"2", name:"חלב 3%", checked:true, price:0},{value:"3", name:"חלב סויה", checked:true, price:0}];
        return milk_types
    }
    
    this.CreateCoffee = function(size, coffeeType, milkType, info, totalPrice){
            userCoffee = {"name":"coffee", "size":size, "coffeeType":coffeeType, "milkType":milkType, "info":info, "price":totalPrice};
        }
    
        this.AddToOrder = function(){
            //Here i need to use the order service in order to write in the order file
            Order.WriteToFile(userCoffee);
            userCoffee = {};
            return 1;
        }
    
    
    return this;
})

.factory('Sandwitch', function () {
    this.getSandwitchesMenu = function(){
        var result = HttpReqs.GetRequest("#");
        
        return result;
    }
})

.factory('Tost', function(Order){
    
        var userTosts;
    
        this.getBreadTypes = function() {
            var bread_types = [{"value":"0","name":"גבטה", "price":15},{"value":"1","name":"בייגל", "price":20 },{"value":"2","name":"קמח מלא", "price":20}];
            
            return bread_types;
        }
    
        this.getTosafot = function(){
            var tosafot = [{"value":"0", "name":"זיתים", "checked": false, "price":1},{"value":"1", "name":"טונה", "checked": false, "price":2},{"value":"2", "name":"גבינה צהובה", "checked": false, "price":3},{"value":"3", "name":"ביצה קשה", "checked": false, "price":4},{"value":"4", "name":"בצל", "checked": false, "price":5}];
            
            return tosafot;
        }    
        
        this.getSauces = function(){
            var sauces = [{"value":"0", "name":"רסק עגבניות", "checked": false, "price":1},{"value":"1", "name":"קטשופ", "checked": false, "price":2},{"value":"2", "name":"מיונז", "checked": false, "price":3},{"value":"3", "name":"שום", "checked": false, "price":4},{"value":"4", "name":"אלף האיים", "checked": false, "price":5}];
            
            return sauces;
        }
        
        this.CreateTost = function(bread, tosafot, sauces, info, totalPrice){
            userTosts = {"name":"bread", "tosafot":tosafot, "sauces":sauces, "info":info, "price":totalPrice};
        }
    
        this.AddToOrder = function(){
            //Here i need to use the order service in order to write in the order file
            Order.WriteToFile(userTosts);
            userTosts = {};
            return 1;
        }
        
        return this;
    
})

.factory('Order', function($cordovaFile, $ionicPlatform){
    this.WriteToFile = function(data){
    }
    
    this.ReadFromFile = function(){ 
    }
    
    return this;
})

.factory('MyFavorites', function(){
    this.getMyFavoriets = function(user){
        var result = HttpReqs.GetRequest("#", user);
        
        return result;
    }
});