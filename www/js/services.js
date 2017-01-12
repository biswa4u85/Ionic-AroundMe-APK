angular.module('ionic.utils', [])

.filter('inSlicesOf', ['$rootScope',
        function($rootScope) {
            makeSlices = function(items, count) {
                if (!count)
                    count = 3;

                if (!angular.isArray(items) && !angular.isString(items)) return items;

                var array = [];
                for (var i = 0; i < items.length; i++) {
                    var chunkIndex = parseInt(i / count, 10);
                    var isFirst = (i % count === 0);
                    if (isFirst)
                        array[chunkIndex] = [];
                    array[chunkIndex].push(items[i]);
                }

                if (angular.equals($rootScope.arrayinSliceOf, array))
                    return $rootScope.arrayinSliceOf;
                else
                    $rootScope.arrayinSliceOf = array;

                return array;
            };

            return makeSlices;
        }
    ])
    .directive('errSrc', function() {
        return {
            link: function(scope, element, attrs) {
                element.bind('error', function() {
                    if (attrs.src != attrs.errSrc) {
                        attrs.$set('src', attrs.errSrc);
                    }
                });
            }
        }
    })

.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})

.directive('headerShrink', function($document) {
    var fadeAmt;

    var shrink = function(header, content, amt, max) {
        amt = Math.min(max, amt);
        fadeAmt = 1 - amt / max;
        ionic.requestAnimationFrame(function() {
            header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
            for (var i = 0, j = header.children.length; i < j; i++) {


                header.children[i].style.opacity = fadeAmt;
            }
        });
    };

    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            var starty = $scope.$eval($attr.headerShrink) || 0;
            var shrinkAmt;

            var amt;

            var y = 0;
            var prevY = 0;
            var scrollDelay = 0.4;

            var fadeAmt;

            var header = $document[0].body.querySelector('.bar-header');
            var headerHeight = header.offsetHeight;

            function onScroll(e) {
                var scrollTop = e.detail.scrollTop;

                if (scrollTop >= 0) {
                    y = Math.min(headerHeight / scrollDelay, Math.max(0, y + scrollTop - prevY));
                } else {
                    y = 0;
                }

                ionic.requestAnimationFrame(function() {
                    fadeAmt = 1 - (y / headerHeight);
                    header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + -y + 'px, 0)';
                    for (var i = 0, j = header.children.length; i < j; i++) {
                        header.children[i].style.opacity = fadeAmt;

                    }
                });

                prevY = scrollTop;
            }

            $element.bind('scroll', onScroll);
        }
    }
})

.service('ItemSo', ['$localstorage', function($localstorage) {
        if ($localstorage.get('itemso') == null || $localstorage.get('itemso') == '') {
            $localstorage.set('itemso', '');
        }

        this.removedebtor = function(accno) {
            try {
                var SList = JSON.parse($localstorage.get('SO'));
                for (var i = 0; i < SList.length; i++) {
                    if (SList[i].Debtor.AccNo == accno) {
                        SList.splice(i, 1);
                        $localstorage.set('SO', JSON.stringify(SList));
                        return;
                    }
                }
            } catch (error) {
                // console.log(error);
            }

        };

        this.addItem = function(o) {
            this.removeItem(o.ItemCode);
            var ItemList;
            try {
                ItemList = JSON.parse($localstorage.get('itemso'));
            } catch (Exception) {
                ItemList = [];
            }
            var ItemSo = o;

            ItemList.push(ItemSo);
            $localstorage.set('itemso', JSON.stringify(ItemList));
        };

        this.removeItem = function(itemcode) {
            try {
                var ItemList = JSON.parse($localstorage.get('itemso'));
                for (var i = 0; i < ItemList.length; i++) {
                    if (ItemList[i].ItemCode == itemcode) {
                        ItemList.splice(i, 1);
                        $localstorage.set('itemso', JSON.stringify(ItemList));
                        return;
                    }
                }
            } catch (error) {

            }

        };

        this.addSO = function(debtor, item, docdate, deliverydate, discount) {
            var SoList = [];
            var itemlist;
            try {
                itemlist = JSON.parse($localstorage.get('itemso'));
                // SoList =JSON.parse($localstorage.get('SO'));    
                SoList = [];
            } catch (Exception) {
                itemlist = [];
                SoList = [];
            }
            var Item = item;
            var So = {
                Debtor: debtor,
                item: itemlist,
                Docdate: docdate,
                Deliverydate: deliverydate,
                Discount: discount
            };
            SoList.push(So);
            $localstorage.set('SO', JSON.stringify(SoList));
        };

    }])
    .service('sharedProperties', function() {
        var property = 'First';

        return {
            getProperty: function() {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
    })

.service('AddToCart', ['$localstorage', function($localstorage) {
    if ($localstorage.get('CartItem') == null || $localstorage.get('CartItem') == '') {
        $localstorage.set('CartItem', '');
    }


    this.removeItem = function(id) {
        try {
            var ItemList = JSON.parse($localstorage.get('CartItem'));
            for (var i = 0; i < ItemList.length; i++) {
                if (ItemList[i].id == id) {
                    ItemList.splice(i, 1);
                    if (ItemList.length > 0) {
                        $localstorage.set('CartItem', JSON.stringify(ItemList));
                    } else {
                        $localstorage.set('CartItem', null);
                    }
                    return;
                }
            }
        } catch (Exception) {
            // console.log(Exception);
        }

    };

    this.AddItemToCart = function(Id, Qty, FileName, Name, Price, SubTotal, Attribute, AttributeValue) {

        var cartItemsm = [];
        var no;
        try {
            cartItemsm = JSON.parse($localstorage.get('CartItem'));
        } catch (Exception) {

            cartItemsm = [];
            no = 1;
        }
        if (cartItemsm == null) {
            var cartItems = [{
                id: Id,
                Quantity: Qty,
                FileName: FileName,
                pname: Name,
                pprice: Price,
                SubTotal: SubTotal,
                Attribute: Attribute,
                AttributeValue: AttributeValue,
            }];
            $localstorage.set('CartItem', JSON.stringify(cartItems));
        } else {
            var cartItems = {
                id: Id,
                Quantity: Qty,
                FileName: FileName,
                pname: Name,
                pprice: Price,
                SubTotal: SubTotal,
                Attribute: Attribute,
                AttributeValue: AttributeValue,
            };
            cartItemsm.push(cartItems);
            $localstorage.set('CartItem', JSON.stringify(cartItemsm));
        }
    };

}])

.service('AddToWishList', ['$localstorage', function($localstorage) {
    if ($localstorage.get('WishListItem') == null || $localstorage.get('WishListItem') == '') {
        $localstorage.set('WishListItem', '');
    }

    this.removeItem = function(id) {
        try {
            var ItemList = JSON.parse($localstorage.get('WishListItem'));
            for (var i = 0; i < ItemList.length; i++) {
                if (ItemList[i].id == id) {
                    ItemList.splice(i, 1);
                    if (ItemList.length > 0) {
                        $localstorage.set('WishListItem', JSON.stringify(ItemList));
                    } else {
                        $localstorage.set('WishListItem', null);
                    }
                    return;
                }
            }
        } catch (Exception) {
            // console.log(Exception);
        }

    };

    this.AddItemToWishList = function(Id, Qty, stockQTY, FileName, Name, Price, SubTotal) {

        var wishItemsm = [];
        var no;
        try {
            wishItemsm = JSON.parse($localstorage.get('WishListItem'));
        } catch (Exception) {

            wishItemsm = [];
            no = 1;
        }
        if (wishItemsm == null) {
            var cartItems = [{
                id: Id,
                idProduct: Id,
                Quantity: Qty,
                FileName: FileName,
                pname: Name,
                pprice: Price,
                SubTotal: SubTotal,
                stockQTY: stockQTY
            }];
            $localstorage.set('WishListItem', JSON.stringify(cartItems));
        } else {
            var cartItems = {
                id: Id,
                idProduct: Id,
                Quantity: Qty,
                FileName: FileName,
                pname: Name,
                pprice: Price,
                SubTotal: SubTotal,
                stockQTY: stockQTY
            };
            wishItemsm.push(cartItems);
            $localstorage.set('WishListItem', JSON.stringify(wishItemsm));
        }
    };

}])

.factory('$localstorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}])

.service('UserService', function() {
    // For the purpose of this example I will store user data on ionic local storage but you should save it on a database

    var setUser = function(user_data) {
        window.localStorage.starter_google_user = JSON.stringify(user_data);
    };

    var getUser = function() {
        return JSON.parse(window.localStorage.starter_google_user || '{}');
    };

    return {
        getUser: getUser,
        setUser: setUser
    };
});
