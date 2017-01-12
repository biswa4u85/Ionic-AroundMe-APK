app.controller('AddNewPlaceCtrl', function($scope, $rootScope, $state, $http, $ionicLoading, $localstorage, $ionicPopup) {

    console.log("addnewplace");
    $scope.Init = function() {
        $scope.model = {
            Name: '',
            Address: '',
            Latitude: '',
            Longtitude: '',
            Phone: '',
            Email: '',
            OpenHours: '',
            Website: '',
            Photo: '',
            User: '',
        }

        $scope.PlaceStatus = false;
        $localstorage.set('MarkLat', null);
        $localstorage.set('MarkLng', null);
        // alert($localstorage.get('LogedinUser'));
        if ($localstorage.get('LogedinUser') == '' || $localstorage.get('LogedinUser') == null || $localstorage.get('LogedinUser') == undefined || $localstorage.get('LogedinUser') == 'null') {
            var alertPopup = $ionicPopup.alert({
                title: 'You are not logged in, Please login to add place.',
            });

            alertPopup.then(function(res) {
                $state.go('app.login');
            });
        }
    }

    $scope.GotoAddPlaceMap = function() {
        $state.go('app.addplacemap');
    }

    $scope.submitform = false;
    $scope.SavePlace = function(objLocation, form) {

        objLocation.Latitude = $localstorage.get('MarkLat');
        objLocation.Longtitude = $localstorage.get('MarkLng');
        objLocation.User = $rootScope.LogedinUser;

        console.log(objLocation.Latitude);
        if (objLocation.Latitude == 'null' || objLocation.Longtitude == 'null') {
            console.log("1...");
            var alertPopup = $ionicPopup.alert({
                title: 'Alert!',
                template: 'Please set Marker'
            });

            alertPopup.then(function(res) {
                return;
            });
        } else {
            console.log("2...");
            if (form.$valid) {
                $rootScope.ShowLoading();
                console.log($scope.objGooglePlaceDetail);
                var randomNum = (Math.floor(Math.random() * 10000000000)).toString();
                if($scope.PlaceStatus)
                {
                $scope.objGoogle = {
                    "placeid": $scope.objGooglePlaceDetail.place_id,
                    "address_components": JSON.stringify($scope.objGooglePlaceDetail.address_components),
                    "display_long_name": $scope.objGooglePlaceDetail.address_components[0].long_name,
                    "display_short_name": $scope.objGooglePlaceDetail.address_components[0].short_name,
                    "formatted_address": $scope.objGooglePlaceDetail.formatted_address,
                    "formatted_phone_number": $scope.model.Phone,
                    "geometry": JSON.stringify($scope.objGooglePlaceDetail.geometry),
                    "icon": "icon",
                    "indoor_outdoor_type": "indoor_outdoor_type",
                    "opening_hours": $scope.model.OpenHours,
                    "owner": "owner",
                    "photos": "photos",
                    "place_id": $scope.objGooglePlaceDetail.place_id,
                    "place_id_scope": "place_id_scope",
                    "placeid_scope": "placeid_scope",
                    "rating": "rating",
                    "reference": "reference",
                    "reviews": "reviews",
                    "types": JSON.stringify($scope.objGooglePlaceDetail.types),
                    "url": "urlllll"
                }
            }
            else{
                $scope.objGoogle = {
                    "placeid": randomNum,
                    "address_components": "address_components",
                    "display_long_name": $scope.model.Name,
                    "display_short_name": $scope.model.Name,
                    "formatted_address": $scope.model.Address,
                    "formatted_phone_number": $scope.model.Phone,
                    "geometry": "geometry",
                    "icon": "icon",
                    "indoor_outdoor_type": "indoor_outdoor_type",
                    "opening_hours": $scope.model.OpenHours,
                    "owner": "owner",
                    "photos": "photos",
                    "place_id": randomNum,
                    "place_id_scope": "place_id_scope",
                    "placeid_scope": "placeid_scope",
                    "rating": "rating",
                    "reference": "reference",
                    "reviews": "reviews",
                    "types": "types",
                    "url": "urlllll"
                }
            }
                console.log($scope.objGoogle);
                //return;
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                $http.post('https://nzfyugg6gk.execute-api.ap-southeast-2.amazonaws.com/development', $scope.objGoogle).success(function(data) {
                    console.log(data);
                    //alert(JSON.stringify(data));

                    $scope.Init();

                    $rootScope.HideLoading();

                    var alertPopup = $ionicPopup.alert({
                        title: 'success',
                        template: 'Place saved successfully'
                    });

                    alertPopup.then(function(res) {
                        $state.go('app.home');
                    });

                });

                // $http.post('http://demob4live.com/api/saveLocation.php', objLocation).success(function(data) {
                //     console.log(data);
                //     //alert(JSON.stringify(data));

                //     $scope.Init();

                //     $rootScope.HideLoading();

                //     var alertPopup = $ionicPopup.alert({
                //         title: 'success',
                //         template: 'Place saved successfully'
                //     });

                //     alertPopup.then(function(res) {
                //         $state.go('app.home');
                //     });

                // });

            } else {
                $scope.submitform = true;
            }
        }

    }

    $scope.GetPlaceDetail = function() {
        //1600+Amphitheatre+Parkway,+Mountain+View,+CA
        $http.post(' https://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.model.Address + '&key=AIzaSyDlkMaNg0dZOG4F2TZFJdv_1YE0EMFZLZE').success(function(data) {
            console.log(data);

            if (data.status == "OK") {
                $scope.PlaceStatus = true;
                console.log(data.results.length)
                $scope.objGooglePlaceDetail = data.results[0];
                console.log($scope.objGooglePlaceDetail);
                $localstorage.set('MarkLat', $scope.objGooglePlaceDetail.geometry.location.lat);
                $localstorage.set('MarkLng', $scope.objGooglePlaceDetail.geometry.location.lng);

                // var alertPopup = $ionicPopup.alert({
                //     title: 'Success',
                //     template: 'Place found successfully'
                // });


            }
             else {
                $scope.PlaceStatus = false;
            //     var alertPopup = $ionicPopup.alert({
            //         title: 'Alert',
            //         template: 'This place not found in map, please enter valid address'
            //     });
            //     alertPopup.then(function(res) {
            //         $scope.model.Address = '';
            //     });
             }


        });
    }

    $scope.Init();
})





// "placeid": Math.floor(Math.random() * 100000),
//             "address_components": "address_components",
//             "display_long_name": "display_long_name",
//             "display_short_name": "display_short_name",
//             "formatted_address": "formatted_address",
//             "formatted_phone_number": "formatted_phone_number",
//             "geometry": "geometry",
//             "icon": "icon",
//             "indoor_outdoor_type": "indoor_outdoor_type",
//             "opening_hours": "opening_hours",
//             "owner": "owner",
//             "photos": "photos",
//             "place_id": "place_id",
//             "place_id_scope": "place_id_scope",
//             "placeid_scope": "placeid_scope",
//             "rating": "rating",
//             "reference": "reference",
//             "reviews": "reviews",
//             "types": "types",
//             "url": "urlllll"
