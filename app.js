angular.module('twitterApp', [])

  .directive('userDropdown', function($timeout){
    return {
      restrict: 'E',
      replace: true,
      scope: {users: '='},
      templateUrl: '/partials/userDropdown.html',
      controller: 'userDropdownCtrl'
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
        $scope["userInfo"] = data;
      });
    };
  })
  .controller('userDropdownCtrl', function ($scope, TwitApi){


  })
;