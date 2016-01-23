angular.module('twitterApp', [])

  .directive('userdisplay', function($timeout){
    return {
      restrict: 'E',
      replace: true,
      scope: {users: '='},
      templateUrl: 'partials/userdisplay.html',
    };
  })

  .factory('TwitApi', ["$http", "$q", "$rootScope", function($http, $q, $rootScope){
    return new TwitApi($http, $q, $rootScope);
  }])

  .controller('formCtrl', function ($scope, TwitApi){
    $scope["formInput"] = {
      search: null,
      retweetnumber: null,
      retweetcheck: false
    }

    $scope["submit"] = function(){
      console.log($scope["formInput"]);
    }

  })
;