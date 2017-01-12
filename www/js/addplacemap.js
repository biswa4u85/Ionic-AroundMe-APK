app.controller('AddPlaceMapCtrl', function($scope, $rootScope, $state, $ionicLoading, $cordovaGeolocation, $ionicPopup, $localstorage, $ionicHistory) {

    console.log("AddPlaceMap..");

    function initMap(lat, lng) {
        var myLatLng = { lat: lat, lng: lng };
        var map = new google.maps.Map(document.getElementById('addplacemap'), {
            center: myLatLng,
            scrollwheel: false,
            // disableDoubleClickZoom: true,
            zoom: 15,
            mapTypeControl: false,
            setMyLocationEnabled: true,
            disableDefaultUI: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['marker']
            },
        });
        drawingManager.setMap(map);

        var marker;
        if ($scope.GotAddress) {
            marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: ''
            });
        } else {
            marker = new google.maps.Marker({
                position: myLatLng,
                // icon: new google.maps.MarkerImage('http://maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                //     new google.maps.Size(22, 22),
                //     new google.maps.Point(0, 18),
                //     new google.maps.Point(11, 11)),
                map: map,
                title: ''
            });
        }
        //var marker;
        $rootScope.HideLoading();
        //Add listener
        google.maps.event.addListener(drawingManager, 'markercomplete', function(event) {
            $scope.latitude = event.getPosition().lat();
            $scope.longitude = event.getPosition().lng();
            event.setMap(null);
            console.log($scope.latitude + ', ' + $scope.longitude);

            var location = new google.maps.LatLng($scope.latitude, $scope.longitude);

            if (marker) {
                //if marker already was created change positon
                marker.setPosition(location);
            } else {
                //create a marker
                marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    icon: new google.maps.MarkerImage('http://maps.google.com/mapfiles/ms/icons/red.png'),
                    draggable: true
                });
            }
        });
        //end addListener
    }

    $scope.SaveMarker = function() {
        console.log($scope.latitude + ', ' + $scope.longitude);

        console.log($scope.latitude);
        if ($scope.latitude != undefined && $scope.longitude != undefined) {
            $localstorage.set('MarkLat', $scope.latitude);
            $localstorage.set('MarkLng', $scope.longitude);
            $state.go('app.addnewplace');

        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Alert!',
                template: 'Please set Marker'
            });

            alertPopup.then(function(res) {
                console.log('Thank you');
            });
        }
    }

    $scope.Back = function() {
        // $state.go('app.addnewplace');
        $ionicHistory.goBack();
    }

    $rootScope.ShowLoading();


    // document.addEventListener("deviceready", onDeviceReady, false);

    // function onDeviceReady() {

    if ($localstorage.get('MarkLat') != 'null' && $localstorage.get('MarkLng') != 'null') {
        console.log($localstorage.get('MarkLat'));
        $scope.GotAddress = true;
        $scope.latitude = parseFloat($localstorage.get('MarkLat'));
        $scope.longitude = parseFloat($localstorage.get('MarkLng'));
        initMap($scope.latitude, $scope.longitude);
    } else {
        console.log("in secon..")
        $scope.GotAddress = false;
        var posOptions = {
            timeout: 3000,
            enableHighAccuracy: false
        };

        // navigator.geolocation.getCurrentPosition(function(position) {
        //    var lat = position.coords.latitude;
        //         var lng = position.coords.longitude;
        //         initMap(lat, lng);
        //     console.log(lat, lng)


        // });

        $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            initMap(lat, lng);
        }, function(err) {
            //alert(JSON.stringify(err));
            initMap($rootScope.defaultLat, $rootScope.defaultLng);
        });

    }

    // }

})
