//Function to log Login Data on Congnito
function callAwsCognito(id_token) {
    // alert("call");
    // return;
    // Initialize the Amazon Cognito credentials provider   
    region = 'ap-northeast-1';
    identitypoolid = 'ap-northeast-1:f163ecc3-0a59-4789-bbbc-b8d2ef8268b0';

    // Initialize the Amazon Cognito credentials provider
    AWS.config.region = region; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identitypoolid,
        Logins: {
            'accounts.google.com': id_token, //Google Login Provider
        }
    });

    //Call Cognito Get Method
    AWS.config.credentials.get(function(err) {
        if (err) {
            alert("Get1 Method Error: " + err);
            return;
        }
        // Credentials will be available when this function is called.

        // Initialize the Cognito Sync client
        AWS.config.credentials.get(function() {
            var syncClient = new AWS.CognitoSyncManager();
            syncClient.openOrCreateDataset('myDataset', function(err, dataset) {

                dataset.put('myKey', 'myValue', function(err, record) {
                    dataset.synchronize({
                        onSuccess: function(data, newRecords) {
                            // Your handler code here
                            alert("Syn Put Done");
                        }
                    });
                });
            });
        });


    });
}


app.controller('LoginCtrl', function($scope, $rootScope, $ionicHistory, $state, $ionicLoading,$cordovaOauth, $compile, $cordovaGeolocation, $cordovaInAppBrowser, $ionicPlatform, $ionicSideMenuDelegate, $localstorage, UserService, $cordovaOauth, $cordovaFacebook) {

    console.log("Login");

    //Google Login
    $scope.googleSignIn = function() {
        $ionicLoading.show({
            template: 'Logging in...'
        });

              window.plugins.googleplus.login({}, function(user_data) {
                      //alert(JSON.stringify(user_data));
                      // For the purpose of this example I will store user data on local storage
                      UserService.setUser({
                          userID: user_data.userId,
                          name: user_data.displayName,
                          email: user_data.email,
                          picture: user_data.imageUrl,
                          accessToken: user_data.accessToken,
                          idToken: user_data.idToken
                      });
                      //
                      if (user_data.displayName == undefined || user_data.displayName == null || user_data.displayName == '') {
                          user_data.displayName = user_data.email;
                      }
                      if (user_data.userId == undefined || user_data.userId == null || user_data.userId == '') {
                          user_data.userId = user_data.email;
                      }
                      var params = {
                          username: user_data.displayName,
                          email: user_data.email,
                          userid: user_data.userId
                      }
                      // alert(JSON.stringify(user_data));
                      // alert(JSON.stringify(UserService));
                      // //callAwsCognito(user_data.accessToken);
                      $ionicLoading.hide();

                      $localstorage.set('IsLoginWith', 'Google');
                      $localstorage.set('LogedinUser', user_data.email);
                      $rootScope.LogedinUser = $localstorage.get('LogedinUser');
                      $rootScope.$apply();
                      $ionicHistory.nextViewOptions({
                          disableBack: true
                      });

                        callAwsCognito(user_data.idToken);

                      $state.go('app.home');
                      // $http.get($scope.API_URL + '/Account/GoogleRegister', { params: params }).success(function(data) {
                      //     $ionicLoading.hide();
                      //     if (data.success == 1) {
                      //         $localstorage.set('IsLoginWith', 'Google');
                      //         $localstorage.set('CurrentUserLogin', user_data.email);
                      //         $localstorage.set('isFromLogin', true);
                      //         $localstorage.set('IsRemember', true);
                      //         $rootScope.CurrentUserLogin = $localstorage.get('CurrentUserLogin');
                      //         $rootScope.$apply();
                      //         $ionicHistory.nextViewOptions({
                      //             disableBack: true
                      //         });
                      //         $scope.addCartFromcoocki();
                      //         $scope.addWishlistFromcoocki();
                      //         // $window.location.reload(true);
                      //         // $state.transitionTo($state.current, $stateParams, {
                      //         //     reload: true,
                      //         //     inherit: false,
                      //         //     notify: true
                      //         // });
                      //         $state.go('app.home');
                      //     }
                      // });
                  },
                  function(msg) {
                      $ionicLoading.hide();
                  }
              );
    };


    //End of Google Login

    //Facebook Login
    $scope.fbLogin = function() {
        $cordovaFacebook.getLoginStatus().then(function(success) {
            //alert(JSON.stringify(success));
            if (success.status == 'connected') {
                $cordovaFacebook.api("/me?fields=id,name,email,first_name,last_name,birthday,gender")
                    .then(function(success) {

                        $scope.FacebookRegister(success);
                    }, function(error) {
                        //alert(JSON.stringify(error));
                        // error
                    });
            } else {
                document.addEventListener("deviceready", function() {
                    $cordovaFacebook.login(["email"])
                        .then(function(success) {
                            //alert(JSON.stringify(success))
                            var options = {
                                method: "feed",
                            };
                            $cordovaFacebook.api("/me?fields=id,name,email,first_name,last_name,birthday,gender")
                                .then(function(success) {
                                    //alert("success2");
                                    //alert(JSON.stringify(success))
                                    $scope.FacebookRegister(success);
                                }, function(error) {
                                    // error
                                    //alert(JSON.stringify(error));
                                });


                        }, function(error) {
                            //alert(JSON.stringify(error));
                        });
                }, false);
            }
        }, function(error) {
            //alert(JSON.stringify(error));
            // error
        });

    }

    $scope.FacebookRegister = function(objFacebook) {
            // alert("success1");
            // alert(JSON.stringify(objFacebook));
            //try {
            $localstorage.set('LogedinUser', objFacebook.email);
            $localstorage.set('IsLoginWith', 'Facebook');
            $rootScope.LogedinUser = $localstorage.get('LogedinUser');
            //                $rootScope.$apply();
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('app.home');
            // } catch (ex) {
            //     alert(JSON.stringify(ex.toString()));
            // }


        }
        //End of Facebook Login

})








// $scope.googleSignIn = function() {
//     var url = 'https://accounts.google.com/o/oauth2/auth' + '?client_id=' + $rootScope.GoogleClientId + '&response_type=code' + '&redirect_uri=' + 'http://localhost' + '&scope=' + 'email';

//     var options = {
//         location: 'no',
//         clearcache: 'no',
//         toolbar: 'no'
//     };

//     $cordovaInAppBrowser.open(url, 'blank', options)
//         .then(function(event) {
//             alert("Sucess:");
//             $scope.LoadGoogleLogin();
//         })
//         .catch(function(event) {
//             alert("Error");
//         });

// }


// $scope.LoadGoogleLogin = function() {
//         $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event) {
//             var url = event.url;
//             var code = /\?code=(.+)$/.exec(url);

//             if (code != null) {
//                 $cordovaInAppBrowser.close();
//                 $rootScope.showLoading();
//                 $http({
//                     url: 'https://www.googleapis.com/oauth2/v3/token',
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//                     params: {
//                         client_id: $rootScope.GoogleClientId,
//                         client_secret: $rootScope.GoogleClientSecret,
//                         redirect_uri: 'http://localhost',
//                         code: code[1],
//                         grant_type: 'authorization_code'
//                     }
//                 }).then(function(data) {
//                     var token = data.data.access_token;
//                     var params = {
//                         access_token: token
//                     }
//                     alert("222");
//                     $http.get('https://www.googleapis.com/oauth2/v3/userinfo', { params: params }).success(function(UserData) {
//                         alert("333");
//                         $localstorage.set('UserId', UserData.sub);
//                         $localstorage.set('Gender', UserData.gender);
//                         $localstorage.set('FullName', UserData.name);
//                         $localstorage.set('LogedinUser', UserData.email);
//                         $localstorage.set('picture', UserData.picture);
//                         $localstorage.set('IsLoginWith', 'Google');


//                         //$rootScope.Access_Token = $localstorage.get('accessToken');
//                         $rootScope.UserId = $localstorage.get('UserId');
//                         $rootScope.Gender = $localstorage.get('Gender');
//                         $rootScope.FullName = $localstorage.get('FullName');
//                         $rootScope.LogedinUser = $localstorage.get('LogedinUser');
//                         $rootScope.Picture = $localstorage.get('picture');

//                         $rootScope.hideLoading();

//                         $ionicHistory.nextViewOptions({
//                             disableBack: true
//                         });
//                         // $state.transitionTo($state.current, $stateParams, {
//                         //     reload: true,
//                         //     inherit: false,
//                         //     notify: true
//                         // });
//                         $state.go('app.home');
//                     })


//                 }, function(error) {
//                     alert(JSON.stringify(error));
//                 })

//             }

//         });
//     }
//     $scope.LoadGoogleLogin();
