angular.module('starter.services', ['ngResource'])


.factory('Session', function ($resource) {
    return $resource('http://192.168.0.113:5000/sessions/:sessionId');
});