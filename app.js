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

    $scope["lookUpUsersDebounced"] = debounce(lookUpUsers, 2000, false);

    function lookUpUsers(){
      TwitApi.getPotentialUsers($scope["formInput"].search).then(function(data){
        console.log(JSON.parse(data));
        $scope["userInfo"] = JSON.parse(data);
      });
    };
  })

  .controller('userDropdownCtrl', function ($scope, TwitApi){

    $scope["displayUser"] = function(user){
      console.log(user.screen_name);
      TwitApi.getSingleUser(user.screen_name).then(function(userObject){
        TwitApi.getUserTimeline(user.screen_name).then(function(userTimeline){
          TwitApi.displayUser(userObject, userTimeline);
        })
      });
    }
  })

  .controller('carouselWrapperCtrl', function ($scope, $log) {

    $scope["app"] = {};
    $scope["app"].slides = [];
    $scope["shouldShow"] = false;

    $scope["app"].options = {
      visible: 3,
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

     console.log(Data);
      $scope["shouldShow"] = false;
      $scope["isLoading"] = true;

      $scope["app"].slides = [];

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

      $scope["isLoading"] = false;
      $scope["shouldShow"] = true;
    });

  })
;