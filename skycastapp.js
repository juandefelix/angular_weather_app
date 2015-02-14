google.setOnLoadCallback(function(){  
    angular.bootstrap(document.body, ['myApp']);
});
google.load('visualization', '1.1', {packages:['corechart', 'bar']});


var app = angular.module('myApp',['google-chart']);

app.controller('weatherCtrl', ['$scope', '$http', function($scope, $http){
    $scope.address = "Madrid";
    $scope.isReady = false;

    $scope.getLocation = function(){
    $scope.currently = {}
    $scope.currently.dataTable = new google.visualization.DataTable();
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
            }). // success
            error(function(data) {
                alert('error');
        })
    }

    function populateTable(results) {
        setCurrently(results.currently);
        // setHourly(results.hourly);
        // setDaily(results.daily);
        $scope.isReady = true;
    }

    function setCurrently(results) {
        $scope.currently.dataTable.addColumn('string', 'Summary');
        $scope.currently.dataTable.addColumn('number', 'Temperature');
        $scope.currently.dataTable.addColumn('number', 'Probability of precipitation');
        $scope.currently.dataTable.addRows([[
          results.summary,
          results.temperature,
          results.precipProbability
        ]]);
    }
}]) // controller


// ==============================================================


var googleChart = googleChart || angular.module("google-chart",[]);

googleChart.directive("googleChart",function(){      
    return {
        restrict : "A",
        link: function(scope, elem, attr) {
            scope.$watch('isReady', function(newValue, oldValue) { 
                if (newValue) {    
                    var dt = scope.currently.dataTable;
                    var options = { 'title':'Current Weather',
                                    'width':600,
                                    'height':300 
                                };
                    if(attr.googleChart == 'PieChart') {
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
