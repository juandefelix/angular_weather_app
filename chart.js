
// Callback that creates and populates a data table, 
// instantiates the pie chart, passes in the data and
// draws it.
  function drawChart(results) {
// console.log(results)
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Summary');
    data.addColumn('number', 'Temperature');
    data.addColumn('number', 'Probability of precipitation');
    data.addRows([
      results.summary,
      results.temperature,
      results.precipitProbability
    ]);

    // // Set chart options
    var options = {'title':'Current Weather',
                   'width':400,
                   'height':300};

    // // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }