app.controller('HomeCtrl', function($scope, $rootScope, $ionicLoading, $compile, $cordovaGeolocation, $ionicPlatform, $ionicSideMenuDelegate, $http) {

    $scope.markersArray = [];
    $scope.qwe = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.ClearSearch = function() {
        $scope.search = '';
    }


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
    $ionicPlatform.ready(function() {


        $rootScope.ShowLoading();

        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: true
        };
        // try {
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {

            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            $scope.current = { lat: lat, lng: long };

            var myLatlng = new google.maps.LatLng(lat, long);

            var mapOptions = {
                center: myLatlng,
                scrollwheel: false,
                disableDoubleClickZoom: true,
                zoom: 15,
                mapTypeControl: false,
                setMyLocationEnabled: true,
                disableDefaultUI: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };


            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

            //$scope.addYourLocationButton($scope.map, mapOptions);


            var divPac = document.getElementById('divPac');
            var input = document.getElementById('pac-input');

            // console.log(input);
            // var params = {
            //     s : "a",  
            // }
            // $http.get('http://demob4live.com/api/getLocation.php', {params : params}).success(function(data) {
            //     console.log(data);
            // })

            var searchBox = new google.maps.places.SearchBox(input);
            $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(divPac);

            setTimeout(function() {
                container = document.getElementsByClassName('pac-container');
                angular.element(container).attr('data-tap-disabled', 'true');
                angular.element(container).on("click", function() {
                    document.getElementById('pac-input').blur();
                });
            }, 500);

            google.maps.event.addListenerOnce($scope.map, 'idle', function() {
                console.log("222");
                var goldStar = {
                    path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
                    fillColor: 'blue',
                    fillOpacity: 1,
                    scale: 0.1,
                    strokeColor: 'blue',
                    strokeWeight: 1
                };
                //icon:goldstar
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    //animation: google.maps.Animation.DROP,
                    icon: new google.maps.MarkerImage('http://maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                        new google.maps.Size(22, 22),
                        new google.maps.Point(0, 18),
                        new google.maps.Point(11, 11)),
                    position: myLatlng,
                    zoom: 15
                });

                $scope.infoWindow = new google.maps.InfoWindow({
                    content: "Here I am!"
                });

                google.maps.event.addListener(marker, 'click', function() {
                    $scope.infoWindow.open($scope.map, marker);
                });

            });


            $rootScope.HideLoading();


            $scope.map.addListener('bounds_changed', function() {
                console.log("111");
                searchBox.setBounds($scope.map.getBounds());
            });

            $scope.markers = [];
            searchBox.addListener('places_changed', function() {
                $rootScope.ShowLoading();
                var places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }


                $scope.markers.forEach(function(marker) {
                    marker.setMap(null);
                });
                markers = [];

                // For each place, get the icon, name and location.
                var bounds = new google.maps.LatLngBounds();
                places.forEach(function(place) {
                    if (!place.geometry) {
                        console.log("Returned place contains no geometry");
                        return;
                    }
                    var icon = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(1, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };


                    console.log(place.rating);

                    var label = place.rating;
                    console.log(label);



                    var marker = new MarkerWithLabel({
                        map: $scope.map,
                        icon: icon,
                        draggable: false,
                        raiseOnDrag: false,
                        labelContent: label,
                        labelAnchor: new google.maps.Point(15, 65),
                        labelClass: "labels", // the CSS class for the label
                        labelInBackground: false,
                        title: place.name,
                        position: place.geometry.location,
                    });

                    markers.push(marker);
                    google.maps.event.addListener(marker, 'click', function() {

                        $scope.infoWindow.setContent(place.name);
                        $scope.infoWindow.open($scope.map, this);
                    });

                    if (place.geometry.viewport) {

                        bounds.union(place.geometry.viewport);
                    } else {
                        $scope.map.setCenter(place.geometry.location);
                        $scope.map.setZoom(15);
                    }


                });
                $scope.map.fitBounds(bounds);
                $rootScope.HideLoading();

            });

        }, function(err) {
            $ionicLoading.hide();
            $scope.map = new google.maps.Map(document.getElementById("map"), {
                zoom: 15,
                center: { lat: $rootScope.defaultLat, lng: $rootScope.defaultLng },
                mapTypeControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                setMyLocationEnabled: true,
                disableDefaultUI: false
            });
            var divPac = document.getElementById('divPac');
            var input = document.getElementById('pac-input');
            var searchBox = new google.maps.places.SearchBox(input);
            $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(divPac);

            //alert('Enable GPS First.');            
            // alert(err);
            //alert('ERROR(' + err.code + '): ' + err.message)
            console.log(err);
            console.log('ERROR(' + err.code + '): ' + err.message);
        });
        // } catch (ex) {
        //     alert(ex.toString());
        // }
    });




    //});
    $scope.find = function() {
        if ($scope.markersArray != []) {
            $scope.clearOverlays();
        }
        var service = new google.maps.places.PlacesService($scope.map);
        service.nearbySearch({
            location: $scope.current,
            radius: 500,
            type: [$scope.search]
        }, $scope.calback);
    }

    $scope.calback = function(results, status) {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                $scope.createMarker(results[i]);
            }
        }
    }

    $scope.clearOverlays = function() {
        for (var i = 0; i < $scope.markersArray.length; i++) {
            $scope.markersArray[i].setMap(null);
        }
        $scope.markersArray.length = 0;
    }

    $scope.createMarker = function(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: place.geometry.location,
            icon: {
                url: place.icon,
                anchor: new google.maps.Point(10, 10),
                scaledSize: new google.maps.Size(20, 17)
            }
        });

        $scope.markersArray.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
            //alert(place.name);
            $scope.infoWindow.setContent(place.name);
            $scope.infoWindow.open($scope.map, this);
        });
    }

    $scope.currentlocation = function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(latlng);
            clearInterval(animationInterval);
            secondChild.style['background-position'] = '-144px 0';


        });
    }

    $scope.addYourLocationButton = function(map, marker) {
        var controlDiv = document.createElement('div');

        var firstChild = document.createElement('button');
        firstChild.style.backgroundColor = '#fff';
        firstChild.style.border = 'none';
        firstChild.style.outline = 'none';
        firstChild.style.width = '28px';
        firstChild.style.height = '28px';
        firstChild.style.borderRadius = '2px';
        firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
        firstChild.style.cursor = 'pointer';
        firstChild.style.marginRight = '10px';
        firstChild.style.padding = '0';
        firstChild.title = 'Your Location';
        controlDiv.appendChild(firstChild);

        var secondChild = document.createElement('div');
        secondChild.style.margin = '5px';
        secondChild.style.width = '18px';
        secondChild.style.height = '18px';
        secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)';
        secondChild.style.backgroundSize = '180px 18px';
        secondChild.style.backgroundPosition = '0 0';
        secondChild.style.backgroundRepeat = 'no-repeat';
        firstChild.appendChild(secondChild);

        google.maps.event.addListener(map, 'center_changed', function() {
            secondChild.style['background-position'] = '0 0';
        });

        firstChild.addEventListener('click', function() {
            var imgX = '0',
                animationInterval = setInterval(function() {
                    imgX = imgX === '-18' ? '0' : '-18';
                    secondChild.style['background-position'] = imgX + 'px 0';
                }, 500);


            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(function(position) {
                    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    map.setCenter(latlng);
                    clearInterval(animationInterval);
                    secondChild.style['background-position'] = '-144px 0';


                });

            } else {
                clearInterval(animationInterval);
                secondChild.style['background-position'] = '0 0';
            }
        });

        controlDiv.index = 1;
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
    }

})
