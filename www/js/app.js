// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('simple-chess', ['ionic', 'simple-chess.controllers', 'simple-chess.services', 'auth0', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, authProvider) {

      authProvider.init({
        domain: 'aderholdst.auth0.com',
        clientID: 'sXR3iRU5my8X7pKE5UWqm7ls5vBA6if1',
        callbackURL: location.href,
        loginState: 'login'
      });

      $httpProvider.interceptors.push('authInterceptor');

      $stateProvider
    // This is the state where you'll show the login
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl',
        data: {
          requiresLogin: true
        }
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html"
        }
      }
    })
    .state('app.games', {
      url: "/games",
      views: {
        'menuContent' :{
          templateUrl: "templates/games.html",
          controller: 'GamesCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/games/:playlistId",
      views: {
        'menuContent' :{
          templateUrl: "templates/game.html",
          controller: 'PlaylistCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/games');
});

