angular.module('twitterApp', ['ngSanitize', 'angular-carousel-3d'])

  .directive('userDropdown', function(){
    return {
      restrict: 'E',
      replace: true,
      scope: {userInfo: '='},
      templateUrl: '/partials/userDropdown.html',
      controller: 'userDropdownCtrl'
    };
  })

  .directive('carouselWrapper', function() {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: '/partials/carouselWrapper.html',
      controller: 'carouselWrapperCtrl'
    };
  })

  .directive('imageWrapper', function() {
    return {
      restrict: 'E',
      scope: {images: '='},
      templateUrl: '/partials/imageWrapper.html',
      controller: 'imageWrapperCtrl'
    };
  })

  .factory('TwitApi', ["$http", "$q", "$rootScope", function($http, $q, $rootScope){
    return new TwitApi($http, $q, $rootScope);
  }])

  .factory('debounce', function($timeout, $q) {
    return function(func, wait, immediate) {
      var timeout;
      var deferred = $q.defer();
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if(!immediate) {
            deferred.resolve(func.apply(context, args));
            deferred = $q.defer();
          }
        };
        var callNow = immediate && !timeout;
        if ( timeout ) {
          $timeout.cancel(timeout);
        }
        timeout = $timeout(later, wait);
        if (callNow) {
          deferred.resolve(func.apply(context,args));
          deferred = $q.defer();
        }
        return deferred.promise;
      };
    };
  })

  .controller('formCtrl', function ($scope, TwitApi, debounce){

    $scope["formInput"] = {
      search: '@',
      retweetnumber: null,
      retweetcheck: false
    };

    $scope["filter"] = function(retweetNumber){
      TwitApi.filterTweets(retweetNumber);
    };

    $scope["reset"] = function(retweetNumber){
      TwitApi.resetTweets(retweetNumber);
    };

    $scope["lookUpUsersDebounced"] = debounce(lookUpUsers, 400, false);

    function lookUpUsers(){
      if($scope["formInput"].search && $scope["formInput"].search != '@' && $scope["formInput"].search.length <= 15){
        TwitApi.getPotentialUsers($scope["formInput"].search).then(function(data){
          if(data){
            $scope["userInfo"] = JSON.parse(data);
          }
        });
      }else{
        $scope["userInfo"] = [];
      }
    };
  })

  .controller('userDropdownCtrl', function ($scope, TwitApi){

    $scope["displayUser"] = function(user){
      TwitApi.getSingleUser(user.screen_name).then(function(userObject){
        TwitApi.getUserTimeline(user.screen_name).then(function(userTimeline){
          TwitApi.displayUser(userObject, userTimeline);
        })
      });
    }
  })

  .controller('imageWrapperCtrl', function ($scope){
    //$scope["display"] = $scope["images"].length > 0 ? true : false;

    if($scope["images"].length > 0){
      $scope["display"] = true;
    }else{
      $scope["display"] = false;
    }
  })

  .controller('carouselWrapperCtrl', function ($scope, $log) {

    $scope["app"] = {};
    $scope["app"].slides = [];
    $scope["shouldShow"] = false;

    $scope["app"].options = {
      visible: 5,
      perspective: 35,
      startSlide: 0,
      border: 0,
      dir: 'ltr',
      width: 360,
      height: 220,
      space: 220,
      controls: true
    };

    $scope.$on("displayUser", function(event, Data){

      $scope["shouldShow"] = false;
      $scope["app"].slides = [];
      $scope["app"].slide_persist = [];

      Data.userdata.profile_image_url_https = Data.userdata.profile_image_url_https.replace(/normal/i, '200x200');

      $scope["user"] = Data.userdata;

      _(Data.timelineData)
          .forEach(function(tweet){

            tweet.hashtags = _(tweet.entities.hashtags)
                              .pluck("text")
                              .value();

            $scope["app"].slides.push(
              {'bg':'#00aced',
                'caption': tweet.text,
                'retweet_count': tweet.retweet_count,
                'favorite_count': tweet.favorite_count,
                'hashtags': tweet.hashtags.length > 0 ? tweet.hashtags.join(' ') : "No Hashtags"
              }
            );
          })
          .value();

      $scope["app"].slides.images = _(Data.timelineData)
                                      .pluck("entities")
                                      .pluck("media")
                                      .remove(function(object){
                                        return object != undefined || null;
                                      })
                                      .flatten()
                                      .pluck("media_url_https")
                                      .value();

      $scope["app"].slide_persist_images = JSON.parse(JSON.stringify($scope["app"].slides.images));
      $scope["app"].slide_persist = JSON.parse(JSON.stringify($scope["app"].slides));

      if(Data.timelineData.length > 0){
        $scope["shouldShow"] = true;
      }
    });

    $scope.$on("filterTweets", function(event, Data){

      if(Data.retweetNumber >= 0 && typeof(Data.retweetNumber)){
        $scope["app"].slides = _($scope["app"].slide_persist)
                                .filter(function(tweet){
                                  return tweet.retweet_count == Data.retweetNumber;
                                })
                                .value();

      }
    });

    $scope.$on("resetTweets", function(event){
      if($scope["app"].slide_persist || $scope["app"].slide_persist > 0){
        $scope["app"].slides = JSON.parse(JSON.stringify($scope["app"].slide_persist));
      }
    });

  })
;