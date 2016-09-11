//GLOBAL VARS
var api_url = "http://cremacafe.herokuapp.com";
var username;
var app = angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ngMessages'
  , 'ngMaterial', 'angular-loading-bar']).run(function ($ionicPlatform, $rootScope, $ionicLoading, $ionicPopup, $state) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.localStorage.getItem("username") != null) $state.go('app.sessions', {}, {
      reload: true
    });
    $rootScope.$on('cfpLoadingBar:loading', function (event) {
      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
        , noBackdrop: false
      });
    });
    $rootScope.$on('cfpLoadingBar:completed', function (event) {
      $ionicLoading.hide();
    });
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    };
  });
}).config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeBar = false;
  $ionicConfigProvider.scrolling.jsScrolling(false);
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
    }
  }).state('app.categories', {
    url: "/categories"
    , views: {
      'menuContent': {
        templateUrl: "templates/categories.html"
        , controller: 'CategoriesCtrl'
      }
    }
  }).state('app.coffee/:view_title/:prod_name', {
    url: "/categories/coffee/:view_title/:prod_name"
    , views: {
      'menuContent': {
        templateUrl: "templates/coffee.html"
        , controller: 'ProdCtrl'
      }
    }
  }).state('app.sandwiches/:view_title/:prod_name', {
    url: "/categories/sandwiches/:view_title/:prod_name"
    , views: {
      'menuContent': {
        templateUrl: "templates/sandwiches.html"
        , controller: 'ProdCtrl'
      }
    }
  }).state('app.shakshuka/:view_title/:prod_name', {
    url: "/categories/shakshuka/:view_title/:prod_name"
    , views: {
      'menuContent': {
        templateUrl: "templates/shakshuka.html"
        , controller: 'ProdCtrl'
      }
    }
  }).state('app.toast/:view_title/:prod_name', {
    url: "/categories/toast/:view_title/:prod_name"
    , views: {
      'menuContent': {
        templateUrl: "templates/toast.html"
        , controller: 'ProdCtrl'
      }
    }
  }).state('app.burekas/:view_title/:prod_name', {
    url: "/categories/burekas/:view_title/:prod_name"
    , views: {
      'menuContent': {
        templateUrl: "templates/burekas.html"
        , controller: 'ProdCtrl'
      }
    }
  }).state('app.nargila/:view_title/:prod_name', {
    url: "/categories/nargila/:view_title/:prod_name"
    , views: {
      'menuContent': {
        templateUrl: "templates/nargila.html"
        , controller: 'ProdCtrl'
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
  $urlRouterProvider.otherwise("/app/login");
});