google.setOnLoadCallback(function(){  
    angular.bootstrap(document.body, ['myApp']);
});
google.load('visualization', '1.1', {packages:['table', 'bar']});


var app = angular.module('myApp',['google-chart']);

app.controller('weatherCtrl', ['$scope', '$http', 'storeLocations', function($scope, $http, storeLocations){
    $scope.isReady = false;
    $scope.locationsList = storeLocations.list;

    $scope.getLocation = function(){
        $scope.isReady = false;
        $scope.location = $scope.address;
        storeLocations.addLocation($scope.address);

        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( {'address': $scope.address }, function(result, status) {
            var lat = result[0].geometry.location.lat();
            var lng = result[0].geometry.location.lng();
            var queryString = 'https://api.forecast.io/forecast/ad95313ec184d7114f912029b416fb5b/' + lat + ',' + lng + "?callback=JSON_CALLBACK";
            getWeatherReport(queryString);
        })
    }

    function getWeatherReport(query){
        $http.jsonp(query).
            success(function(data){
                populateTable(data)
            }).
            error(function(data) {
                alert('error');
        })
    }

    function populateTable(results) {
        setCurrently(results.currently);
        setHourly(results.hourly);
        setDaily(results.daily);
        $scope.isReady = true;
    }

    function setCurrently(results) {
        $scope.current = {}
        $scope.current.tableTitle = 'Current Weather';
        $scope.current.width = 600
        $scope.current.height = 100
        $scope.current.dataTable = new google.visualization.DataTable();
        $scope.current.dataTable.addColumn('string', 'Summary');
        $scope.current.dataTable.addColumn('number', 'Temperature');
        $scope.current.dataTable.addColumn('number', 'Probability of precipitation');
        $scope.current.dataTable.addRows([[
          results.summary,
          results.temperature,
          results.precipProbability
        ]]);
    }

    function setHourly(results){
        var data = results.data.slice(0, 9);
        var log = [['Hour','Temperature', 'Visibility', 'WindSpeed']];
        angular.forEach(data, function(elem) {
            var hour = data.indexOf(elem) + 1;
            this.push([hour + " h.", elem.temperature, elem.visibility, elem.windSpeed]);
        }, log);

        $scope.hourly  = {};
        $scope.hourly.tableTitle = 'Hourly Weather';
        $scope.hourly.width = 600
        $scope.hourly.height = 300
        $scope.hourly.dataTable = google.visualization.arrayToDataTable(log);        
    }

    function setDaily(results){
        console.log(results);
        var data = results.data.slice(0, 8);
        var log = [['Day','Max Temperature', 'Min Temperature', 'Visibility', 'WindSpeed']];
        angular.forEach(data, function(elem) {
            var hour = data.indexOf(elem) + 1;
            this.push([hour + " d.", elem.temperatureMax, elem.temperatureMin, elem.visibility, elem.windSpeed]);
        }, log);

        $scope.daily  = {};
        $scope.daily.tableTitle = 'Daily Weather';
        $scope.daily.width = 600
        $scope.daily.height = 300
        $scope.daily.dataTable = google.visualization.arrayToDataTable(log);        
    }
}]).
factory('storeLocations', function() {
  var list = [];
  function addLocation(value){
    if (value !== ""){
        list.push(value);
    }
  };
  return { 
    addLocation: addLocation, 
    list: list
  };
}); 


var googleChart = googleChart || angular.module("google-chart",[]);

googleChart.directive("googleChart",function(){      
    return {
        restrict : "A",
        link: function(scope, elem, attr) {
            scope.$watch('isReady', function(newValue, oldValue) { 
                if (newValue) {    
                    var dt = scope[attr.ngModel].dataTable;

                    var options = { 'title':scope[attr.ngModel].tableTitle,
                                    'width':scope[attr.ngModel].width,
                                    'height':scope[attr.ngModel].height 
                                };
                    if (attr.googleChart == 'Table') {
                        var googleChart = new google.visualization[attr.googleChart](elem[0]);
                    } else {
                        var googleChart = new google.charts[attr.googleChart](elem[0]);
                    }
                    googleChart.draw(dt,options);
                    $(elem).show();
                }
                else { 
                    $(elem).hide(); 
                }
            });
        }
    }
});
