// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ngMaterial']).run(function ($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    //    $ionicPlatform.ready(function(){
    //        db = $cordovaSQLite.openDB("local.db");
    //        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS products(id integer primary key not null auto_increment identity(1,1), product_name text not null, product_info text not null, produt_price float not null)");
    //        $cordoveSQLite.execute(db, "CREATE TABLE IF NOT EXISTS order(id integer primary key no null auto_increment identity(1,1), products integer foreign key references products(id) not null, total_price float not null, delay_time integer not null, costumer_name text not null, costumer_phone text not null)");
    //    });
  });
}).config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('app', {
    url: '/app'
    , abstract: true
    , templateUrl: 'templates/menu.html'
    , controller: 'AppCtrl'
  }).state('app.login', {
    url: '/login'
    , views: {
      'menuContent': {
        templateUrl: 'templates/login.html'
        , controller: 'LoginCtrl'
      }
      , 'fabContent': {
        template: ''
      }
    }
  }).state('app.categories', {
    url: "/categories"
    , views: {
      'menuContent': {
        templateUrl: "templates/categories.html"
        , controller: 'CategoriesCtrl'
      }
    }
  }).state('app.coffee', {
    url: "/categories/coffee"
    , views: {
      'menuContent': {
        templateUrl: "templates/coffee.html"
        , controller: 'CoffeeCtrl'
      }
    }
  }).state('app.toast', {
    url: "/categories/toast"
    , views: {
      'menuContent': {
        templateUrl: "templates/toast.html"
        , controller: 'ToastCtrl'
      }
    }
  }).state('app.search', {
    url: '/search'
    , views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  }).state('app.browse', {
    url: '/browse'
    , views: {
      'menuContent': {
        templateUrl: 'templates/browse.html'
      }
    }
  }).state('app.sessions', {
    url: "/sessions"
    , views: {
      'menuContent': {
        templateUrl: "templates/sessions.html"
        , controller: 'SessionsCtrl'
      }
    }
  }).state('app.order', {
    url: "/order"
    , views: {
      'menuContent': {
        templateUrl: "templates/order.html"
        , controller: 'OrderCtrl'
      }
    }
  }).state('app.session', {
    url: "/sessions/:sessionId"
    , views: {
      'menuContent': {
        templateUrl: "templates/session.html"
        , controller: 'SessionCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise("/app/sessions");
});