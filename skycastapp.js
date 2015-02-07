google.setOnLoadCallback(function(){  
    angular.bootstrap(document.body, ['myApp']);
});
google.load('visualization', '1.0', {'packages':['corechart']});


var app = angular.module('myApp',['google-chart']);

app.controller('weatherCtrl', ['$scope', '$http', function($scope, $http){
    $scope.address = "Madrid";

    $scope.getLocation = function(){
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
            success(populateTable ). // success
            error(function(data) {
                alert('error')
        })
    }

    function populateTable (results) {
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
            ['Mushrooms', 3, 1],
            ['Onions', 1, 1],
            ['Olives', 1, 1],
            ['Eggplant', 1, 1],
            ['Pepperoni', 2, 1]
        ]);
    }

}]) // controller


// ==============================================================


var googleChart = googleChart || angular.module("google-chart",[]);

googleChart.directive("googleChart",function(){  
    return{
        restrict : "A",
        link: function($scope, $elem, $attr){

            console.log('DATA', $scope[$elem.ngModel])
            var dt = $scope[$elem.ngModel].dataTable;
            var options = {'title':'Current Weather',
                            'width':400,
                            'height':300};

            var googleChart = new google.visualization[$attr.googleChart]($elem[0]);
            googleChart.draw(dt,options);
        }
    }
});
