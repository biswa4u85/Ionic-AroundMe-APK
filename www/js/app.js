// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova','ngCordovaOauth', 'starter.controllers', 'ionic.utils'])

.run(function($ionicPlatform, $localstorage, $rootScope, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    $rootScope.LogedinUser = '';
    if($localstorage.get("LogedinUser") != '')
    {
      $rootScope.LogedinUser  = $localstorage.get("LogedinUser");
    }

    $rootScope.GoogleClientId = "365721239767-pk0sgcs2jbqal1usrgddnt8ok491hn00.apps.googleusercontent.com";
    $rootScope.GoogleClientSecret = "_4k0ujitQqN0hc9_WDCCrrIy";

    $rootScope.defaultLat =  -37.817883;
    $rootScope.defaultLng =  144.968342;

    $rootScope.ShowLoading = function() {

        $ionicLoading.show({
            content: 'Getting current location...',
            template: '<ion-spinner class="spinner-energized"></ion-spinner>',
            showBackdrop: false
        });
    }

    $rootScope.HideLoading = function() {
      $ionicLoading.hide();
    }
    
    // console

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

   .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

    .state('app.Logout', {
        url: "/Logout",
        views: {
            'menuContent': {
                controller: 'LogOutCtrl'
            }
        },
         cache: false
    })

  .state('app.addnewplace', {
      url: '/addnewplace',
      views: {
        'menuContent': {
          templateUrl: 'templates/addnewplace.html',
          controller: 'AddNewPlaceCtrl'
        }
      }
    })

   .state('app.addplacemap', {
      url: '/addplacemap',
      views: {
        'menuContent': {
          templateUrl: 'templates/addplacemap.html',
          controller: 'AddPlaceMapCtrl'
        }
      }
    })

    .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })

    .state('app.sendfeaturereq', {
      url: '/sendfeaturereq',
      views: {
        'menuContent': {
          templateUrl: 'templates/sendfeaturereq.html',
          controller: 'SendfeaturereqCtrl'
        }
      }
    })

    .state('app.help', {
      url: '/help',
      views: {
        'menuContent': {
          templateUrl: 'templates/help.html',
          controller: 'HelpCtrl'
        }
      }
    })

  .state('app.termsofservice', {
    url: '/termsofservice',
    views: {
      'menuContent': {
        templateUrl: 'templates/termsofservice.html',
        controller: 'TermsofserviceCtrl'
      }
    }
  })

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
