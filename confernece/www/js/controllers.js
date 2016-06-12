angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal

})

.controller('LoginCtrl', function($scope, $stateParams, Session) {
  })

  .controller('CategoriesCtrl', function($scope, $stateParams, Session, $ionicNavBarDelegate) {
    $ionicNavBarDelegate.showBackButton(true);
  })

  .controller('BreadsCtrl', function($scope, $stateParams, Session, $ionicNavBarDelegate) {
  })

.controller('SessionsCtrl', function($rootScope, $scope, Session, $ionicNavBarDelegate ) {
    $ionicNavBarDelegate.showBackButton(false);
})

.controller('SessionCtrl', function($scope, $stateParams, Session) {
  $scope.session = Session.get({sessionId: $stateParams.sessionId});
});
