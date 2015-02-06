"use strict";

google.setOnLoadCallback(function(){  
    angular.bootstrap(document.body, ['myApp']);
});
google.load('visualization', '1.0', {'packages':['corechart']});

// Callback that creates and populates a data table, 
// instantiates the pie chart, passes in the data and
// draws it.

var app = angular.module('myApp',['google-chart']);

    // Create the data table.

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
        success(function(results) {

              console.log('on jsonp')
          google.setOnLoadCallback(function(results){
              $scope.data = {};
              $scope.data.dataTable = new google.visualization.DataTable();
              $scope.data.dataTable.addColumn('string', 'Summary');
              $scope.data.dataTable.addColumn('number', 'Temperature');
              $scope.data.dataTable.addColumn('number', 'Probability of precipitation');
              // data.addRows([
              //   results.currently.summary,
              //   results.currently.temperature,
              //   results.currentlu.precipitProbability
              // ]);

          $scope.data.dataTable.addRows([
              ['Mushrooms', 3],
              ['Onions', 1],
              ['Olives', 1],
              ['Eggplant', 1],
              ['Pepperoni', 2]
            ]);
          });
        

        }). // success
        error(function(data) {
          alert('error')
        })
    }) // geocode
  } // getLocation
}]) // controller


// ==============================================================


var googleChart = googleChart || angular.module("google-chart",[]);

googleChart.directive("googleChart",function(){  
    return{
        restrict : "A",
        link: function($scope, $elem, $attr){
            var dt = $scope.dataTable;
          console.log(dt)

            var options = {'title':'Current Weather',
                             'width':400,
                             'height':300};

            var googleChart = new google.visualization[$attr.googleChart]($elem[0]);
            googleChart.draw(dt,options)
        }
    }
});
