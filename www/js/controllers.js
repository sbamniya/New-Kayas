/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})

.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk, ApiURL) {
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();
})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, ApiURL) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $http, ApiURL) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab('right');
    $scope.loading = true;
    // Activate ink for controller
    
    $scope.categories = [];
    $http.get(ApiURL+'request.php?method=get_categories_id').success(function(response){
        //console.log(response.categories);
        if (response.status==200) {
            $scope.categories = response.data.posts;
              $timeout(function() {
                ionicMaterialMotion.fadeSlideIn({
                    selector: '.item'
                });
                $scope.loading = false;
            }, 200);


        }else{
            alert('Error');
        }
    });
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $http, ApiURL, $state) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.loading = true;
    $scope.noPost = false;

    $scope.commentData = {};
    var user = window.localStorage.getItem('userDetails');
    
    if (!angular.isUndefined(user) && user!=null && user!='') {
        var userDetails = JSON.parse(user);
        $scope.commentData.email = userDetails.email;
        $scope.commentData.name = userDetails.name;
        if (!angular.isUndefined(userDetails.url)) {
            $scope.commentData.url = userDetails.url;
        }
    }
    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    var postId = $stateParams.postId;
    var catID = $stateParams.catID;
    $http.get(ApiURL+'request.php?method=post_detail&post_id='+postId).success(function(response){
        if (response.status==200) {
            $scope.posts = response.data.posts;
            
            $scope.loading = false;
            //console.log($scope.post);
        }else{
            alert('Error');
        }
    });
    // Set Ink
    ionicMaterialInk.displayEffect();

    $scope.addComment = function(){
        $scope.loading = true;
        window.localStorage.setItem('userDetails', JSON.stringify($scope.commentData));

        $http.get(ApiURL+'request.php?method=addcomment&id='+postId+'&author='+ $scope.commentData.name + '&email=' + $scope.commentData.email + '&content=' + $scope.commentData.content + '&url=' + $scope.commentData.url).success(function(response){
            if (response.status==200) {
                $scope.loading = false;
                alert('Your comment has been submitted successfully !');
            }
        });
    }
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $http, ApiURL) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.loading = true;
    $scope.noPost = false;

    var id = $stateParams.catID;
    $scope.catID = id;
    $http.get(ApiURL+'request.php?method=category_post&cat_id='+id+'&pagination=3').success(function(response){
        if (response.status==200) {
            var log = [];
            var res = response.data.posts;
            $scope.cat = response.data.posts;
            angular.forEach(res, function(item, key){
                var date = new Date(item.date);
                item.date = date.getTime();
                log.push(item);
            });
            $scope.posts = log;
            $timeout(function() {
                ionicMaterialMotion.fadeSlideInRight({
                    selector: '.item'
                });
                $scope.loading = false;
            }, 0);
            if ($scope.posts.length==0) {
                $scope.noPost = true;
            }
        }else{
            alert('Error');
        }
    });
    ionicMaterialInk.displayEffect ();
})

.controller('author',function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $http, ApiURL){
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');
    $scope.loading = true;
    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();

    $scope.author = {
        name : 'Kalika Prasad',
        intro: '"A simple thought can change your entire life & observartion brings wisdom." To understand things one needs it to be well explained & our author & Friend Kalika took an Initiative by his awesome Writing skills & Presence of mind.<br>Stay tuned for more kayass along with our friend - "Kalika Prasad".'
    }
    $scope.loading = false;
})

.controller('HomeCtrl', ['$scope', '$stateParams', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', '$http','$ionicSlideBoxDelegate','ApiURL', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $http, $ionicSlideBoxDelegate, ApiURL){
        $scope.interVal = 2000;
        $scope.loading = true;
        var api = ApiURL+'request.php?method=featuredpost'
        $http.get(api).success(function(response){
            //console.log(response.data.posts);
            if (response.status==200) {
                var posts = response.data.posts;
                var temp = [];
                angular.forEach(posts, function(item, key){
                    //item.date = new Date(item.date);
                    //item.catID = item.categories[0].id;
                    temp.push(item);
                });
                //$scope.posts = temp;
                $scope.slides = temp;
                $ionicSlideBoxDelegate.update();
                $ionicSlideBoxDelegate.loop(true);
                //console.log(response.posts)
                var api = ApiURL+'request.php?method=recentpost'
                $http.get(api).success(function(response){
                    //console.log(response.data.posts);
                    
                        var posts = response;
                        var temps = [];
                        angular.forEach(posts, function(item, key){
                            //item.date = new Date(item.date);
                            //item.catID = item.categories[0].id;
                            temps.push(item);
                        });
                        $scope.posts = temps;
                        //$scope.slides = temp;
                        $ionicSlideBoxDelegate.update();
                        $ionicSlideBoxDelegate.loop(true);
                        //console.log(response.posts)
                        $timeout(function() {
                            ionicMaterialMotion.fadeSlideIn({
                                selector: '.item'
                            });
                            $scope.loading = false;
                        }, 1000);
                });
            }else{
                alert('Error');
            }
        });
        
}])
;
