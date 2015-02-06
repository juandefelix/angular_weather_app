var app = angular.module('myApp',[]);

app.controller('weatherCtrl', ['$scope', '$http', function($scope, $http){
  $scope.address = "Madrid";
  $scope.getLocation = function(){
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode( {'address': $scope.address }, function(result, status) {
      var lat = result[0].geometry.location.lat();
      var lng = result[0].geometry.location.lng();
      var queryString = 'https://api.forecast.io/forecast/ad95313ec184d7114f912029b416fb5b/' + lat + ',' + lng + "?callback=JSON_CALLBACK";
      // console.log(queryString)
      
      $http.jsonp(queryString).
        success(function(data) {
          console.log(data.daily.data[0])
        }).
        error(function(data) {
          // console.log(queryString)
        })
    }) // geocode
  } // getLocation
}]) // controller
