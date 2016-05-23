angular.module("test", ['ui.router', 'ngAnimate']);
angular.module('test').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/home');
    $locationProvider.hashPrefix('!');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/src/app/home.html',
            controller: 'homeCtrl',
            controllerAs: "ctrl"
        })
        .state('answers', {
            url: '/answers',
            templateUrl: '/src/app/answers.html',
            controller: 'answersCtrl',
            controllerAs: "ctrl"
        })
    ;
});
